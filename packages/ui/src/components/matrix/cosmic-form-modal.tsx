"use client"

import React, { useState, useEffect } from "react"
import { X, Save, AlertCircle, MessageSquare, CalendarCheck, CheckCircle2, Printer, History } from "lucide-react"
import type { ModelSchema } from "@workspace/types"
import { CosmicFieldWidget } from "./cosmic-field-widget"
import { apiGet, apiPost, apiDelete } from "@moon/client"
import { APP_PORTS } from "@workspace/types"
import { cosmicAudio } from "../cosmic-sound-synthesizer"
import { printRecordBriefing } from "../../lib/report-printer"

const getApiBase = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  return `http://127.0.0.1:${APP_PORTS.API_BACKEND}`
}

export interface CosmicFormModalProps {
  isOpen: boolean
  onClose: () => void
  schema: ModelSchema
  initialRecord?: Record<string, any> | null
  onSave: (vals: Record<string, any>) => Promise<void>
}

export function CosmicFormModal({
  isOpen,
  onClose,
  schema,
  initialRecord,
  onSave,
}: CosmicFormModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Chatter, Activity & Version Audit state
  const [messages, setMessages] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [activities, setActivities] = useState<any[]>([])
  const [activitySummary, setActivitySummary] = useState("")
  const [activityDate, setActivityDate] = useState("")
  const [versions, setVersions] = useState<any[]>([])

  const isEdit = Boolean(initialRecord?.id)
  const formConfig = schema.views?.form
  const sections = formConfig?.sections || [
    {
      title: "GENERAL",
      columns: 2,
      fields: Object.keys(schema.fields).filter((f) => !schema.fields[f]?.invisible),
    },
  ]

  // Initialize form state
  useEffect(() => {
    if (initialRecord) {
      setFormData({ ...initialRecord })
    } else {
      const defaults: Record<string, any> = {}
      for (const [k, def] of Object.entries(schema.fields)) {
        if (def.default !== undefined) defaults[k] = def.default
      }
      setFormData(defaults)
    }
    setError(null)
  }, [initialRecord, schema])

  // Fetch chatter & activities if enabled and editing an existing record
  const fetchAuditData = () => {
    if (isOpen && isEdit && formConfig?.chatter && initialRecord?.id) {
      apiGet<{ data: any[] }>(
        `${getApiBase()}/api/mail.message?resModel=${schema.name}&resId=${initialRecord.id}&limit=20`
      )
        .then((res) => setMessages(Array.isArray(res?.data) ? res.data : []))
        .catch(() => {})

      apiGet<{ data: any[] }>(
        `${getApiBase()}/api/mail.activity?resModel=${schema.name}&resId=${initialRecord.id}&limit=20`
      )
        .then((res) => setActivities(Array.isArray(res?.data) ? res.data : []))
        .catch(() => {})

      apiGet<{ data: any[] }>(
        `${getApiBase()}/api/ir.version?resModel=${schema.name}&resId=${initialRecord.id}&limit=20`
      )
        .then((res) => setVersions(Array.isArray(res?.data) ? res.data : []))
        .catch(() => {})
    }
  }

  useEffect(() => {
    fetchAuditData()
  }, [isOpen, isEdit, formConfig?.chatter, initialRecord?.id, schema.name])

  if (!isOpen) return null

  const handleFieldChange = (key: string, val: any) => {
    setFormData((prev) => ({ ...prev, [key]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    // Validate required fields
    for (const [key, def] of Object.entries(schema.fields)) {
      if (def.required && !def.readonly && !def.invisible) {
        const val = formData[key]
        if (val === undefined || val === null || val === "") {
          cosmicAudio.playAlertTone()
          setError(`Required field missing: ${def.label}`)
          setSaving(false)
          return
        }
      }
    }

    // Construct clean payload (extract IDs from objects, filter read-only)
    const cleanedPayload: Record<string, any> = {}
    for (const [key, def] of Object.entries(schema.fields)) {
      if (def.readonly) continue
      const val = formData[key]
      if (def.type === "many2one" && typeof val === "object" && val !== null) {
        cleanedPayload[key] = val.id ?? null
      } else if (val !== undefined) {
        cleanedPayload[key] = val
      }
    }

    try {
      await onSave(cleanedPayload)
      cosmicAudio.playSuccessChime()
      onClose()
    } catch (err: any) {
      cosmicAudio.playAlertTone()
      setError(err?.message || "Failed to persist record.")
    } finally {
      setSaving(false)
    }
  }

  const handleAddComment = async () => {
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
    } catch (e) {
      console.warn("Failed to post comment:", e)
    }
  }

  const handleScheduleActivity = async () => {
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
    } catch (e) {
      console.warn("Failed to schedule activity:", e)
    }
  }

  const handleCompleteActivity = async (activityId: number) => {
    try {
      await apiDelete(`${getApiBase()}/api/mail.activity/${activityId}`)
      fetchAuditData()
    } catch (e) {
      console.warn("Failed to complete activity:", e)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-cyber-dark/95 border border-cyber-cyan/40 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col overflow-hidden corner-box">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-cyan/20 bg-cyber-panel/60">
          <div>
            <span className="text-[10px] font-mono text-cyber-cyan tracking-widest uppercase">
              {schema.name} // {isEdit ? `RECORD #${initialRecord?.id}` : "GENESIS INSTANCE"}
            </span>
            <h2 className="text-lg font-bold text-white tracking-wide uppercase font-orbitron">
              {formConfig?.title || schema.description || schema.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {isEdit && (
              <button
                type="button"
                onClick={() => printRecordBriefing(schema, formData)}
                title="Print Record Report"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 border border-cyber-cyan/30 rounded text-xs font-mono text-cyber-cyan hover:bg-cyber-cyan/10 uppercase transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PRINT REPORT</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-steel-gray hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-cyber-pink/10 border border-cyber-pink/40 rounded text-cyber-pink text-xs font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Sections */}
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-xs font-bold text-cyber-cyan tracking-widest uppercase border-b border-cyber-cyan/10 pb-1">
                {sec.title}
              </h3>
              <div
                className={`grid gap-4 ${
                  sec.columns === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {sec.fields.map((fKey) => {
                  const fieldDef = schema.fields[fKey]
                  if (!fieldDef || fieldDef.invisible) return null
                  return (
                    <div key={fKey} className="space-y-1">
                      <label className="block text-[11px] font-mono text-steel-gray uppercase tracking-wider">
                        {fieldDef.label} {fieldDef.required && <span className="text-cyber-pink">*</span>}
                      </label>
                      <CosmicFieldWidget
                        field={fieldDef}
                        value={formData[fKey]}
                        onChange={(val) => handleFieldChange(fKey, val)}
                        disabled={saving}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Scheduled Activities Panel */}
          {isEdit && formConfig?.chatter && (
            <div className="space-y-3 pt-4 border-t border-cyber-cyan/10">
              <h3 className="flex items-center gap-2 text-xs font-bold text-cyber-yellow tracking-widest uppercase">
                <CalendarCheck className="w-3.5 h-3.5" /> SCHEDULED ACTIVITIES & REMINDERS
              </h3>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {activities.length === 0 ? (
                  <p className="text-[11px] text-steel-gray font-mono">No pending activities.</p>
                ) : (
                  activities.map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-2 bg-cyber-yellow/5 border border-cyber-yellow/20 rounded text-xs font-mono">
                      <div>
                        <span className="text-white font-semibold">{act.summary}</span>
                        <div className="text-[10px] text-steel-gray">DUE: {String(act.dateDue).slice(0, 10)}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCompleteActivity(act.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-cyber-green/10 border border-cyber-green/30 rounded text-[10px] text-cyber-green hover:bg-cyber-green/20 uppercase"
                      >
                        <CheckCircle2 className="w-3 h-3" /> DONE
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Activity note (e.g. Call partner, review RFC)..."
                  value={activitySummary}
                  onChange={(e) => setActivitySummary(e.target.value)}
                  className="flex-1 bg-black/60 border border-cyber-yellow/20 rounded px-3 py-1.5 text-xs text-white placeholder-steel-gray/40 focus:border-cyber-yellow/60 focus:outline-none"
                />
                <input
                  type="date"
                  value={activityDate}
                  onChange={(e) => setActivityDate(e.target.value)}
                  className="bg-black/60 border border-cyber-yellow/20 rounded px-2 py-1.5 text-xs text-white focus:border-cyber-yellow/60 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleScheduleActivity}
                  className="px-3 py-1.5 bg-cyber-yellow/10 border border-cyber-yellow/30 rounded text-cyber-yellow text-xs font-mono hover:bg-cyber-yellow/20 uppercase"
                >
                  SCHEDULE
                </button>
              </div>
            </div>
          )}

          {/* Universal Chatter Widget */}
          {isEdit && formConfig?.chatter && (
            <div className="space-y-3 pt-4 border-t border-cyber-cyan/10">
              <h3 className="flex items-center gap-2 text-xs font-bold text-cyber-cyan tracking-widest uppercase">
                <MessageSquare className="w-3.5 h-3.5" /> CHATTER & AUDIT TRAIL (@moon/mail)
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-[11px] text-steel-gray font-mono">No communication records attached.</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className="p-2 bg-black/40 border border-cyber-cyan/10 rounded text-xs">
                      <div className="flex justify-between text-[10px] text-steel-gray mb-1">
                        <span>{m.messageType?.toUpperCase() || "LOG"}</span>
                        <span>{new Date(m.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-white font-mono">{m.body}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Post dispatch log..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-black/60 border border-cyber-cyan/20 rounded px-3 py-1.5 text-xs text-white placeholder-steel-gray/40 focus:border-cyber-cyan/60 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="px-3 py-1.5 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded text-cyber-cyan text-xs font-mono hover:bg-cyber-cyan/20 uppercase"
                >
                  TRANSMIT
                </button>
              </div>
            </div>
          )}

          {/* Mutation History & Audit Trail */}
          {isEdit && formConfig?.chatter && (
            <div className="space-y-3 pt-3 border-t border-cyber-cyan/20">
              <h3 className="text-xs font-bold text-cyber-cyan tracking-widest uppercase flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-cyber-cyan" />
                MUTATION AUDIT TRAIL ({versions.length})
              </h3>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {versions.length === 0 ? (
                  <p className="text-[11px] text-steel-gray font-mono">No prior field mutation logs recorded.</p>
                ) : (
                  versions.map((v) => (
                    <div key={v.id} className="p-2 bg-black/40 border border-cyber-cyan/10 rounded text-xs font-mono">
                      <div className="flex justify-between text-[10px] text-steel-gray mb-1">
                        <span className="text-cyber-cyan font-bold">{v.summary || "MUTATION"}</span>
                        <span>{new Date(v.createdAt).toLocaleString()}</span>
                      </div>
                      {v.changedFields && (
                        <p className="text-[11px] text-steel-gray">
                          Fields: <span className="text-white">{v.changedFields}</span>
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-cyber-cyan/20 bg-cyber-panel/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-transparent border border-steel-gray/30 rounded text-xs font-mono text-steel-gray hover:text-white uppercase transition-colors"
          >
            ABORT
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 bg-cyber-cyan/20 border border-cyber-cyan rounded text-xs font-mono text-cyber-cyan hover:bg-cyber-cyan/30 uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)]"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "EXECUTING..." : isEdit ? "COMMIT MORPH" : "INITIALIZE INSTANCE"}
          </button>
        </div>
      </div>
    </div>
  )
}
