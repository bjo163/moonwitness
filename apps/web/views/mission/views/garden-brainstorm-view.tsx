"use client"

import { FormEvent, useState } from "react"
import { AlertTriangle, LoaderCircle, Send, Sprout } from "lucide-react"
import { ContextBlock, Panel, PanelHeader } from "@workspace/ui"
import { GARDEN_BRAINSTORM_CONFIG } from "../data/garden-brainstorm.config"
import {
  BrainstormTask,
  parseTasksFromMarkdown,
} from "../data/garden-brainstorm-parser"

type BrainstormForm = {
  project: string
  outcome: string
  affectedPeople: string
  constraints: string
}

const EMPTY_FORM: BrainstormForm = {
  project: "",
  outcome: "",
  affectedPeople: "",
  constraints: "",
}

export function GardenBrainstormView() {
  const [form, setForm] = useState<BrainstormForm>(EMPTY_FORM)
  const [result, setResult] = useState("")
  const [tasks, setTasks] = useState<BrainstormTask[]>([])
  const [questions, setQuestions] = useState<string[]>([])
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof BrainstormForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setQuestions([])
    setResult("")
    setTasks([])
    setIsSubmitting(true)

    try {
      const response = await fetch(
        "/api/mission/garden-brainstorm?format=json",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      )

      if (response.status === 422) {
        const payload = (await response.json()) as {
          clarificationQuestions: string[]
        }
        setQuestions(payload.clarificationQuestions)
        return
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(
          payload?.error || "The brainstorm service is unavailable."
        )
      }

      const payload = (await response.json()) as {
        tasks?: BrainstormTask[]
        markdown?: string
      }

      if (payload.tasks && payload.tasks.length === 10) {
        setTasks(payload.tasks)
      }
      setResult(payload.markdown || "")
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The brainstorm could not be completed."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="theme-grid-bg min-h-screen py-8 font-mono text-foreground">
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title={GARDEN_BRAINSTORM_CONFIG.title}
          subtitle={GARDEN_BRAINSTORM_CONFIG.subtitle}
          operation={GARDEN_BRAINSTORM_CONFIG.operation}
          status="ONLINE"
          accentColor="success"
        />

        <div className="grid gap-6 lg:grid-cols-5">
          <Panel level="level2" accentColor="success" className="lg:col-span-2">
            <PanelHeader
              title="// PROJECT CONTEXT"
              status="REQUIRED"
              icon={Sprout}
              accentColor="success"
              subtitle="Describe the real work before requesting a plan."
            />
            <form className="mt-4 space-y-4" onSubmit={submit}>
              <Field
                label="PROJECT OR REAL PROBLEM"
                value={form.project}
                onChange={(value) => updateField("project", value)}
                placeholder="What needs to change or be built?"
                required
              />
              <Field
                label="DESIRED OUTCOME"
                value={form.outcome}
                onChange={(value) => updateField("outcome", value)}
                placeholder="What good result should this create?"
                required
              />
              <Field
                label="AFFECTED PEOPLE"
                value={form.affectedPeople}
                onChange={(value) => updateField("affectedPeople", value)}
                placeholder="Who benefits or carries the impact?"
                required
              />
              <Field
                label="CONSTRAINTS OR ETHICAL CONCERNS"
                value={form.constraints}
                onChange={(value) => updateField("constraints", value)}
                placeholder="Budget, timeline, risks, trust, fairness, or safety."
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex w-full items-center justify-center gap-2 px-4 py-2 text-xs btn-clip disabled:opacity-50"
              >
                {isSubmitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? "CULTIVATING PLAN..." : "GENERATE 10 TASKS"}
              </button>
            </form>
          </Panel>

          <div className="space-y-6 lg:col-span-3">
            <Panel level="level2" accentColor="success">
              <PanelHeader
                title="// PRIORITIZED ACTIONS"
                status={tasks.length > 0 || result ? "RECEIVED" : "WAITING"}
                icon={Sprout}
                accentColor="success"
                subtitle="Exactly ten actionable tasks appear here after context is complete."
              />
              <ResultState
                result={result}
                tasks={tasks}
                questions={questions}
                error={error}
              />
            </Panel>

            <Panel level="level1" accentColor="warning">
              <div className="flex gap-3">
                <AlertTriangle className="text-warning mt-0.5 h-4 w-4 shrink-0" />
                <div className="space-y-2 text-[11px] leading-relaxed text-foreground/80">
                  <p className="text-warning font-bold">
                    {GARDEN_BRAINSTORM_CONFIG.archetype.name}
                  </p>
                  <p>{GARDEN_BRAINSTORM_CONFIG.archetype.description}</p>
                  {GARDEN_BRAINSTORM_CONFIG.boundaries.map((boundary) => (
                    <p key={boundary}>{boundary}</p>
                  ))}
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  required?: boolean
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] font-bold text-primary">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        rows={3}
        maxLength={required ? 2500 : 1200}
        className="tag-clip bg-space w-full border border-primary/30 p-3 text-xs text-foreground placeholder:text-primary/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
      />
    </label>
  )
}

function ResultState({
  result,
  tasks,
  questions,
  error,
}: {
  result: string
  tasks: BrainstormTask[]
  questions: string[]
  error: string
}) {
  const parsedTasks = tasks.length > 0 ? tasks : parseTasksFromMarkdown(result)

  if (error)
    return (
      <p className="mt-4 border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
        {error}
      </p>
    )
  if (questions.length > 0)
    return (
      <ul className="border-warning/30 bg-warning/10 text-warning mt-4 space-y-2 border p-3 text-xs">
        {questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ul>
    )
  if (!result)
    return (
      <p className="bg-space/60 mt-4 border border-primary/15 p-4 text-xs leading-relaxed text-primary/70">
        Complete the project context to receive a focused action plan.
      </p>
    )

  if (!parsedTasks) {
    return (
      <pre className="border-success/25 bg-space/70 mt-4 max-h-[620px] overflow-auto border p-4 text-xs leading-relaxed whitespace-pre-wrap text-foreground">
        {result}
      </pre>
    )
  }

  return (
    <div className="mt-4 space-y-3">
      {parsedTasks.map((task, index) => (
        <div
          key={`${task.title}-${index}`}
          className="tag-clip border-success/25 bg-space/70 border p-3"
        >
          <div className="border-success/20 mb-2 flex flex-wrap items-center justify-between gap-2 border-b pb-2">
            <p className="text-success text-[10px] font-bold">
              TASK {String(index + 1).padStart(2, "0")}
            </p>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="tag-clip tag-clip-green px-2 py-0.5 font-bold">
                {task.type}
              </span>
              <span className="font-bold text-primary">{task.score}/99</span>
            </div>
          </div>
          <p className="text-sm font-bold text-foreground">{task.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-foreground/80">
            {task.goal}
          </p>
        </div>
      ))}
    </div>
  )
}
