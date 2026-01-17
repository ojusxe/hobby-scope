import { perplexity } from "@ai-sdk/perplexity";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { learningPlanSearchMetaSchema } from "@/lib/search-schemas";
import { resolveLearningPlan } from "@/lib/resource-resolver";
import { NextResponse } from "next/server";

export const maxDuration = 60;

//  openrouter fallback
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

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

For each technique, provide search metadata for 2-3 learning resources.
DO NOT provide direct URLs - only provide search queries and intent.

For video resources:
- type: "video"
- title: A descriptive title for what the video should cover
- searchQuery: An optimized YouTube search query to find this type of tutorial
- intent: What the learner should gain from watching
- maxDurationMinutes: (optional) Preferred max video length (5-15 mins ideal for tutorials)

For article resources:
- type: "article"  
- title: A descriptive title for what the article should cover
- searchQuery: An optimized web search query to find this guide/article
- intent: What the learner should gain from reading
- preferredSources: (optional) Array of preferred domains like "wikihow.com", "medium.com"

User input:
Hobby: ${hobby}
Level: ${level}

Output rules:
- Return ONLY valid JSON
- Do NOT include markdown
- Do NOT include explanations outside JSON
- Do NOT include URLs - only search queries
- Follow this exact structure:

{
  "techniques": [
    {
      "title": "Technique Name",
      "description": "1-2 sentence description",
      "resourceSearchMeta": [
        { 
          "type": "video", 
          "title": "How to do X - Beginner Tutorial",
          "searchQuery": "how to X for beginners tutorial",
          "intent": "Learn the basic motion and form",
          "maxDurationMinutes": 10
        },
        { 
          "type": "article", 
          "title": "Complete Guide to X",
          "searchQuery": "complete beginner guide to X step by step",
          "intent": "Understand the theory and common mistakes",
          "preferredSources": ["wikihow.com", "medium.com"]
        }
      ]
    }
  ]
}

Generate a focused, practical learning plan with detailed search metadata.`;

  try {
    // Generate the plan with search metadata (no URLs)
    let planWithMeta;
    
    try {
      // Try Perplexity first
      const result = await generateObject({
        model: perplexity("sonar"),
        schema: learningPlanSearchMetaSchema,
        prompt,
      });
      planWithMeta = result.object;
    } catch (error) {
      console.error("[@generatePlan] pplx API error:", error);
      // Fallback to OpenRouter
      const result = await generateObject({
        model: openrouter("google/gemini-2.0-flash-001"),
        schema: learningPlanSearchMetaSchema,
        prompt,
      });
      planWithMeta = result.object;
    }

    // Resolve search metadata to actual URLs using external APIs
    console.log("[@generatePlan] Resolving resources for plan...");
    const resolvedPlan = await resolveLearningPlan(planWithMeta);
    
    console.log(`[@generatePlan] Resolved ${resolvedPlan.techniques.length} techniques`);
    
    return NextResponse.json(resolvedPlan);
  } catch (error) {
    console.error("[@generatePlan] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}
