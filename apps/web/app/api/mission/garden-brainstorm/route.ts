import { z } from "zod"
import { GoogleGenAI } from "@google/genai"
import { GARDEN_BRAINSTORM_PROMPT } from "@/views/mission/data/garden-brainstorm.prompt"
import {
  formatTasksAsMarkdown,
  normalizeTasks,
  parseTasksFromMarkdown,
} from "@workspace/types"

const requestSchema = z
  .object({
    project: z.string().trim().max(2500).optional(),
    outcome: z.string().trim().max(1200).optional(),
    affectedPeople: z.string().trim().max(1200).optional(),
    constraints: z.string().trim().max(1200).optional(),
    sessionId: z.string().trim().min(1).max(120).optional(),
  })
  .strict()

function getApiKeys() {
  return [
    process.env.GOOGLE_GEMINI_API_KEY_007,
    process.env.GOOGLE_GEMINI_API_KEY_AGUS,
    process.env.GOOGLE_GEMINI_API_KEY_BJO,
    process.env.GOOGLE_GEMINI_API_KEY_MILEY,
    process.env.GOOGLE_GEMINI_API_KEY_PDD,
    process.env.GOOGLE_GEMINI_API_KEY_RAHMAN,
    process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  ].filter(Boolean) as string[]
}

function missingContext(input: z.infer<typeof requestSchema>) {
  const requiredFields = [
    ["project", "What is the project or real problem to solve?"],
    ["outcome", "What outcome do you want?"],
    ["affectedPeople", "Who will be affected by this work?"],
  ] as const

  return requiredFields
    .filter(([field]) => !input[field]?.trim())
    .map(([, question]) => question)
}

export async function POST(req: Request) {
  try {
    const requestUrl = new URL(req.url)
    const wantsJson = requestUrl.searchParams.get("format") === "json"

    const parsed = requestSchema.safeParse(await req.json())
    if (!parsed.success) {
      return Response.json(
        {
          error: "Invalid brainstorm request",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      )
    }

    const questions = missingContext(parsed.data)
    if (questions.length > 0) {
      return Response.json(
        { clarificationQuestions: questions },
        { status: 422 }
      )
    }

    const apiKeys = getApiKeys()
    if (apiKeys.length === 0) {
      return Response.json(
        { error: "No Gemini API keys configured" },
        { status: 500 }
      )
    }

    const currentKey = apiKeys[Math.floor(Math.random() * apiKeys.length)]
    const ai = new GoogleGenAI({ apiKey: currentKey })

    const context = [
      `Project or problem: ${parsed.data.project}`,
      `Desired outcome: ${parsed.data.outcome}`,
      `Affected people: ${parsed.data.affectedPeople}`,
      parsed.data.constraints
        ? `Constraints: ${parsed.data.constraints}`
        : null,
    ]
      .filter(Boolean)
      .join("\n")

    const attempts = [
      {
        temperature: 0.7,
        promptSuffix: "",
      },
      {
        temperature: 0.2,
        promptSuffix:
          "Return only the required TASK 01 to TASK 10 format with no extra commentary.",
      },
    ]

    let normalizedMarkdown: string | null = null
    let normalizedTasks: ReturnType<typeof normalizeTasks> | null = null

    for (const attempt of attempts) {
      const userText = attempt.promptSuffix
        ? `${context}\n\n${attempt.promptSuffix}`
        : context

      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL_ID || "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: userText }] }],
        config: {
          systemInstruction: GARDEN_BRAINSTORM_PROMPT,
          temperature: attempt.temperature,
        },
      })

      const text = response.text || ""
      const parsedTasks = parseTasksFromMarkdown(text)
      if (!parsedTasks) continue

      normalizedTasks = normalizeTasks(parsedTasks)
      normalizedMarkdown = formatTasksAsMarkdown(normalizedTasks)
      break
    }

    if (!normalizedMarkdown || !normalizedTasks) {
      return Response.json(
        {
          error:
            "The generated output did not match the required 10-task format. Please retry with clearer project context.",
        },
        { status: 502 }
      )
    }

    if (wantsJson) {
      return Response.json({
        tasks: normalizedTasks,
        markdown: normalizedMarkdown,
      })
    }

    return new Response(normalizedMarkdown, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    })
  } catch (error) {
    console.error("[Garden Brainstorm Route]", error)
    return Response.json(
      { error: "Unable to start brainstorm" },
      { status: 500 }
    )
  }
}
