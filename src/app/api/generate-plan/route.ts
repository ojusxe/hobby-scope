import { perplexity } from "@ai-sdk/perplexity";
import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

// OpenRouter (fallback)
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

import { learningPlanSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const { hobby, level } = await req.json();

  const prompt = `You are helping design a learning plan for a hobby.

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
  - resource title (a realistic, descriptive title for the resource)
  - resource url (a real, working URL to the actual resource)

IMPORTANT - URL Requirements:
- For videos: MUST be a valid YouTube URL (format: https://www.youtube.com/watch?v=... or https://youtu.be/...)
- For articles: MUST be a valid URL to a real article on the internet (from reputable sources)
- For audio: MUST be a valid URL to audio content (podcasts, audio lessons, etc.)
- All URLs must be real, accessible links that exist on the internet
- Use your web search capabilities to find actual, relevant resources

User input:
Hobby: ${hobby}
Level: ${level}

Output rules:
- Return ONLY valid JSON
- Do NOT include markdown
- Do NOT include explanations outside JSON
- Follow this exact structure:

{
  "techniques": [
    {
      "title": "",
      "description": "",
      "resources": [
        { "type": "video", "title": "", "url": "https://www.youtube.com/watch?v=..." },
        { "type": "article", "title": "", "url": "https://example.com/article" },
        { "type": "audio", "title": "", "url": "https://example.com/audio" }
      ]
    }
  ]
}

Generate a focused, practical learning plan with REAL, WORKING URLs.`;

  try {
    // Try Perplexity first (using official @ai-sdk/perplexity provider)
    const result = streamObject({
      model: perplexity("sonar"),
      schema: learningPlanSchema,
      prompt,
    });
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Perplexity API error:", error);
    // Fallback to OpenRouter (free)
    try {
      const result = streamObject({
        model: openrouter("xiaomi/mimo-v2-flash:free"),
        schema: learningPlanSchema,
        prompt,
      });
      return result.toTextStreamResponse();
    } catch (fallbackError) {
      console.error("OpenRouter fallback error:", fallbackError);
      throw fallbackError;
    }
  }
}
