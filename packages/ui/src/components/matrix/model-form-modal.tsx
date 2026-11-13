"use client"

import React, { useCallback, useEffect, useState } from "react"
import { AlertCircle, CalendarCheck, CheckCircle2, History, MessageSquare, Printer, Save, X } from "lucide-react"
import { apiDelete, apiGet, apiPost } from "@moon/client"
import type { ModelSchema } from "@workspace/types"
import { APP_PORTS } from "@workspace/types"
import { printRecordBriefing } from "../../lib/report-printer"
import { soundEngine } from "../audio-synthesizer"
import { ModelFieldWidget } from "./model-field-widget"

const getApiBase = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  return `http://127.0.0.1:${APP_PORTS.API_BACKEND}`
}

export interface ModelFormModalProps {
  isOpen: boolean
  onClose: () => void
  schema: ModelSchema
  initialRecord?: Record<string, any> | null
  onSave: (vals: Record<string, any>) => Promise<void>
}

type ModelFormSection = {
  title: string
  columns: number
  fields: string[]
}

type ModelFormModalController = {
  formData: Record<string, any>
  saving: boolean
  error: string | null
  messages: any[]
  newComment: string
  activities: any[]
  activitySummary: string
  activityDate: string
  versions: any[]
  isEdit: boolean
  formConfig: any
  sections: ModelFormSection[]
  handleFieldChange: (key: string, value: any) => void
  handleSubmit: () => Promise<void>
  handleAddComment: () => Promise<void>
  handleScheduleActivity: () => Promise<void>
  handleCompleteActivity: (activityId: number) => Promise<void>
  setNewComment: (value: string) => void
  setActivitySummary: (value: string) => void
  setActivityDate: (value: string) => void
}

function getInitialFormData(schema: ModelSchema, initialRecord?: Record<string, any> | null) {
  if (initialRecord) return { ...initialRecord }

  const defaults: Record<string, any> = {}
  for (const [key, field] of Object.entries(schema.fields)) {
    if (field.default !== undefined) defaults[key] = field.default
  }
  return defaults
}

function getFormSections(schema: ModelSchema): ModelFormSection[] {
  const configuredSections = schema.views?.form?.sections as ModelFormSection[] | undefined
  if (configuredSections) return configuredSections

  return [
    {
      title: "GENERAL",
      columns: 2,
      fields: Object.keys(schema.fields).filter((fieldName) => !schema.fields[fieldName]?.invisible),
    },
  ]
}

export function useModelFormModalController({
  isOpen,
  onClose,
  schema,
  initialRecord,
  onSave,
}: ModelFormModalProps): ModelFormModalController {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [activities, setActivities] = useState<any[]>([])
  const [activitySummary, setActivitySummary] = useState("")
  const [activityDate, setActivityDate] = useState("")
  const [versions, setVersions] = useState<any[]>([])

  const isEdit = Boolean(initialRecord?.id)
  const formConfig = schema.views?.form
  const sections = getFormSections(schema)

  useEffect(() => {
    setFormData(getInitialFormData(schema, initialRecord))
    setError(null)
  }, [initialRecord, schema])

  const fetchAuditData = useCallback(() => {
    if (!(isOpen && isEdit && formConfig?.chatter && initialRecord?.id)) return

    apiGet<{ data: any[] }>(
      `${getApiBase()}/api/mail.message?resModel=${schema.name}&resId=${initialRecord.id}&limit=20`,
    )
      .then((res) => setMessages(Array.isArray(res?.data) ? res.data : []))
      .catch(() => {})

    apiGet<{ data: any[] }>(
      `${getApiBase()}/api/mail.activity?resModel=${schema.name}&resId=${initialRecord.id}&limit=20`,
    )
      .then((res) => setActivities(Array.isArray(res?.data) ? res.data : []))
      .catch(() => {})

    apiGet<{ data: any[] }>(
      `${getApiBase()}/api/ir.version?resModel=${schema.name}&resId=${initialRecord.id}&limit=20`,
    )
      .then((res) => setVersions(Array.isArray(res?.data) ? res.data : []))
      .catch(() => {})
  }, [formConfig?.chatter, initialRecord?.id, isEdit, isOpen, schema.name])

  useEffect(() => {
    fetchAuditData()
  }, [fetchAuditData])

  const handleFieldChange = useCallback((key: string, value: any) => {
    setFormData((previous) => ({ ...previous, [key]: value }))
  }, [])

  const handleSubmit = useCallback(async () => {
    setSaving(true)
    setError(null)

    for (const [key, field] of Object.entries(schema.fields)) {
      if (field.required && !field.readonly && !field.invisible) {
        const value = formData[key]
        if (value === undefined || value === null || value === "") {
          soundEngine.playAlertTone()
          setError(`Required field missing: ${field.label}`)
          setSaving(false)
          return
        }
      }
    }

    const cleanedPayload: Record<string, any> = {}
    for (const [key, field] of Object.entries(schema.fields)) {
      if (field.readonly) continue
      const value = formData[key]
      if (field.type === "many2one" && typeof value === "object" && value !== null) {
        cleanedPayload[key] = value.id ?? null
      } else if (value !== undefined) {
        cleanedPayload[key] = value
      }
    }

    try {
      await onSave(cleanedPayload)
      soundEngine.playSuccessChime()
      onClose()
    } catch (err: any) {
      soundEngine.playAlertTone()
      setError(err?.message || "Failed to persist record.")
    } finally {
      setSaving(false)
    }
  }, [formData, onClose, onSave, schema.fields])

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim() || !initialRecord?.id) return
    try {
      await apiPost(`${getApiBase()}/api/mail.message`, {
        resModel: schema.name,
        resId: initialRecord.id,
        body: newComment,
        messageType: "comment",
      })
      setNewComment("")
      fetchAuditData()
    } catch (requestError) {
      console.warn("Failed to post comment:", requestError)
    }
  }, [fetchAuditData, initialRecord?.id, newComment, schema.name])

  const handleScheduleActivity = useCallback(async () => {
    if (!activitySummary.trim() || !initialRecord?.id) return
    try {
      await apiPost(`${getApiBase()}/api/mail.activity`, {
        resModel: schema.name,
        resId: initialRecord.id,
        summary: activitySummary,
        dateDue: activityDate || new Date().toISOString().slice(0, 10),
        status: "planned",
      })
      setActivitySummary("")
      setActivityDate("")
      fetchAuditData()
    } catch (requestError) {
      console.warn("Failed to schedule activity:", requestError)
    }
  }, [activityDate, activitySummary, fetchAuditData, initialRecord?.id, schema.name])

  const handleCompleteActivity = useCallback(async (activityId: number) => {
    try {
      await apiDelete(`${getApiBase()}/api/mail.activity/${activityId}`)
      fetchAuditData()
    } catch (requestError) {
      console.warn("Failed to complete activity:", requestError)
    }
  }, [fetchAuditData])

  return {
    formData,
    saving,
    error,
    messages,
    newComment,
    activities,
    activitySummary,
    activityDate,
    versions,
    isEdit,
    formConfig,
    sections,
    handleFieldChange,
    handleSubmit,
    handleAddComment,
    handleScheduleActivity,
    handleCompleteActivity,
    setNewComment,
    setActivitySummary,
    setActivityDate,
  }
}

type ModelFormSectionsProps = {
  schema: ModelSchema
  sections: ModelFormSection[]
  formData: Record<string, any>
  saving: boolean
  onFieldChange: (key: string, value: any) => void
}

function ModelFormSections({ schema, sections, formData, saving, onFieldChange }: ModelFormSectionsProps) {
  return (
    <>
      {sections.map((section, index) => (
        <div key={`${section.title}-${index}`} className="space-y-3">
          <h3 className="border-b border-border pb-1 text-xs font-bold tracking-wider text-primary uppercase">
            {section.title}
          </h3>
          <div className={`grid gap-4 ${section.columns === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
            {section.fields.map((fieldKey) => {
              const field = schema.fields[fieldKey]
              if (!field || field.invisible) return null

              return (
                <div key={fieldKey} className="space-y-1">
                  <label className="block text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                    {field.label} {field.required ? <span className="text-destructive">*</span> : null}
                  </label>
                  <ModelFieldWidget
                    field={field}
                    value={formData[fieldKey]}
                    onChange={(value) => onFieldChange(fieldKey, value)}
                    disabled={saving}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </>
  )
}

type ModelFormAuditProps = Pick<
  ModelFormModalController,
  | "activities"
  | "activityDate"
  | "activitySummary"
  | "handleAddComment"
  | "handleCompleteActivity"
  | "handleScheduleActivity"
  | "messages"
  | "newComment"
  | "setActivityDate"
  | "setActivitySummary"
  | "setNewComment"
  | "versions"
>

function ModelFormAuditPanels({
  activities,
  activityDate,
  activitySummary,
  handleAddComment,
  handleCompleteActivity,
  handleScheduleActivity,
  messages,
  newComment,
  setActivityDate,
  setActivitySummary,
  setNewComment,
  versions,
}: ModelFormAuditProps) {
  return (
    <>
      <section className="space-y-3 border-t border-border pt-4">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-warning uppercase">
          <CalendarCheck className="h-3.5 w-3.5" /> Scheduled Activities & Reminders
        </h3>
        <div className="max-h-36 space-y-2 overflow-y-auto">
          {activities.length === 0 ? (
            <p className="font-sans text-[11px] text-muted-foreground">No pending activities.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between rounded-lg border border-warning/20 bg-amber-500/5 p-2 font-sans text-xs">
                <div>
                  <span className="font-semibold text-foreground">{activity.summary}</span>
                  <div className="text-[10px] text-muted-foreground">Due: {String(activity.dateDue).slice(0, 10)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCompleteActivity(activity.id)}
                  className="flex items-center gap-1 rounded border border-success/30 bg-success/10 px-2 py-1 text-[10px] font-semibold text-success uppercase hover:bg-success/20"
                >
                  <CheckCircle2 className="h-3 w-3" /> Done
                </button>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Activity note (e.g. Follow up, review ticket)..."
            value={activitySummary}
            onChange={(event) => setActivitySummary(event.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <input
            type="date"
            value={activityDate}
            onChange={(event) => setActivityDate(event.target.value)}
            className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={handleScheduleActivity}
            className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning uppercase hover:bg-warning/20"
          >
            Schedule
          </button>
        </div>
      </section>

      <section className="space-y-3 border-t border-border pt-4">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-primary uppercase">
          <MessageSquare className="h-3.5 w-3.5" /> Comments & Activity Log
        </h3>
        <div className="max-h-40 space-y-2 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="font-sans text-[11px] text-muted-foreground">No communication records attached.</p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="rounded-lg border border-border bg-muted/40 p-2 text-xs">
                <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>{message.messageType?.toUpperCase() || "LOG"}</span>
                  <span>{new Date(message.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-foreground">{message.body}</p>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Post a comment..."
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddComment}
            className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary uppercase hover:bg-primary/20"
          >
            Post
          </button>
        </div>
      </section>

      <section className="space-y-3 border-t border-border pt-3">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-primary uppercase">
          <History className="h-3.5 w-3.5 text-primary" /> Change History ({versions.length})
        </h3>
        <div className="max-h-36 space-y-2 overflow-y-auto">
          {versions.length === 0 ? (
            <p className="font-sans text-[11px] text-muted-foreground">No change history recorded.</p>
          ) : (
            versions.map((version) => (
              <div key={version.id} className="rounded-lg border border-border bg-muted/30 p-2 text-xs">
                <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                  <span className="font-semibold text-primary">{version.summary || "Update"}</span>
                  <span>{new Date(version.createdAt).toLocaleString()}</span>
                </div>
                {version.changedFields ? (
                  <p className="text-[11px] text-muted-foreground">
                    Fields: <span className="text-foreground">{version.changedFields}</span>
                  </p>
                ) : null}
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}

type ModelFormModalPresentationProps = ModelFormModalProps & {
  controller: ModelFormModalController
}

function ModelFormModalPresentation({
  isOpen,
  onClose,
  schema,
  initialRecord,
  controller,
}: ModelFormModalPresentationProps) {
  if (!isOpen) return null

  const showAudit = controller.isEdit && Boolean(controller.formConfig?.chatter)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card font-sans shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
          <div>
            <span className="font-mono text-[10px] tracking-wider text-primary uppercase">
              {schema.name} • {controller.isEdit ? `Record #${initialRecord?.id}` : "New Record"}
            </span>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {controller.formConfig?.title || schema.description || schema.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {controller.isEdit ? (
              <button
                type="button"
                onClick={() => printRecordBriefing(schema, controller.formData)}
                title="Print Record Report"
                className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
              >
                <Printer className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Print Report</span>
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            void controller.handleSubmit()
          }}
          className="flex-1 space-y-6 overflow-y-auto p-6"
        >
          {controller.error ? (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{controller.error}</span>
            </div>
          ) : null}

          <ModelFormSections
            schema={schema}
            sections={controller.sections}
            formData={controller.formData}
            saving={controller.saving}
            onFieldChange={controller.handleFieldChange}
          />
          {showAudit ? <ModelFormAuditPanels {...controller} /> : null}
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/30 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-transparent px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={controller.saving}
            onClick={() => void controller.handleSubmit()}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {controller.saving ? "Saving..." : controller.isEdit ? "Save Changes" : "Create Record"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ModelFormModal(props: ModelFormModalProps) {
  const controller = useModelFormModalController(props)
  return <ModelFormModalPresentation {...props} controller={controller} />
}
