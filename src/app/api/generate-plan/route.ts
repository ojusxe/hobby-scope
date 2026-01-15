import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

const resourceSchema = z.object({
  type: z.enum(["video", "article", "audio"]),
  title: z.string(),
});

const techniqueSchema = z.object({
  title: z.string(),
  description: z.string(),
  resources: z.array(resourceSchema).min(2).max(3),
});

const learningPlanSchema = z.object({
  techniques: z.array(techniqueSchema).min(5).max(8),
});

export async function POST(req: Request) {
  const { hobby, level } = await req.json();

  const result = streamObject({
    model: google("gemini-2.0-flash"),
    schema: learningPlanSchema,
    prompt: `You are helping design a learning plan for a hobby.

Context:
The user wants to learn a hobby without information overload.
They do NOT want to master everything or become a professional.
They want a small, focused plan with only the most important techniques.

Your task:
- Create a learning plan with 5 to 8 techniques only.
- Each technique should be practical and suitable for the given level.
- Keep explanations short and beginner-friendly.
- Avoid unnecessary theory or advanced concepts.
- Prefer techniques that give maximum improvement with minimal effort.

For each technique, include:
- title (short)
- description (1–2 sentences)
- resources (2–3 items only)
  - resource type: video, article, or audio
  - resource title (a realistic title for the resource)

User input:
Hobby: ${hobby}
Level: ${level}

Generate a focused, practical learning plan.`,
  });

  return result.toTextStreamResponse();
}
