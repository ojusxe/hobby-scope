import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { learningPlanSearchMetaSchema } from "@/lib/search-schemas";
import { searchYouTube } from "@/lib/youtube-search";
import { searchArticle } from "@/lib/article-search";
import type { ResourceSearchMeta, TechniqueWithSearchMeta } from "@/lib/search-schemas";
import type { Resource, Technique } from "@/lib/schemas";

export const maxDuration = 60;

// OpenRouter is the primary LLM provider
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Helper to send SSE events
function sendEvent(controller: ReadableStreamDefaultController, event: string, data: unknown) {
  const encoder = new TextEncoder();
  controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function extractJsonObject(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model did not return a JSON object");
  }

  return text.slice(start, end + 1);
}

// Resolve a single resource
async function resolveResource(meta: ResourceSearchMeta): Promise<Resource | null> {
  try {
    if (meta.type === "video") {
      return await searchYouTube(meta);
    } else if (meta.type === "article") {
      return await searchArticle(meta);
    }
    return null;
  } catch (error) {
    console.error("[ResourceResolver] Error resolving resource:", error);
    return null;
  }
}

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

  const stream = new ReadableStream({
    async start(controller) {
      try {
        sendEvent(controller, "progress", { 
          step: "ai", 
          message: "Generating your personalized learning plan... May take a few seconds" 
        });

        const result = await withTimeout(
          generateText({
            model: openrouter("google/gemini-2.0-flash-001"),
            prompt,
          }),
          30000,
          "OpenRouter request"
        );

        const rawJson = extractJsonObject(result.text);
        const parsed = JSON.parse(rawJson);
        const planWithMeta = learningPlanSearchMetaSchema.parse(parsed);

        const totalTechniques = planWithMeta.techniques.length;
        sendEvent(controller, "progress", { 
          step: "ai-complete", 
          message: `Plan ready! Found ${totalTechniques} techniques to master` 
        });

        // Step 2: Resolve resources for each technique
        const techniques: Technique[] = [];

        for (let i = 0; i < planWithMeta.techniques.length; i++) {
          const techniqueMeta: TechniqueWithSearchMeta = planWithMeta.techniques[i];
          
          sendEvent(controller, "progress", { 
            step: "technique", 
            message: `Finding resources for "${techniqueMeta.title}" (${i + 1}/${totalTechniques})`,
            current: i + 1,
            total: totalTechniques
          });

          // Count videos and articles for this technique
          const videoCount = techniqueMeta.resourceSearchMeta.filter(r => r.type === "video").length;
          const articleCount = techniqueMeta.resourceSearchMeta.filter(r => r.type === "article").length;

          if (videoCount > 0) {
            sendEvent(controller, "progress", { 
              step: "youtube", 
              message: `Searching YouTube for ${videoCount} video${videoCount > 1 ? 's' : ''}...` 
            });
          }

          // Resolve resources in parallel
          const resolvedResources: Resource[] = [];
          const results = await Promise.allSettled(
            techniqueMeta.resourceSearchMeta.map(meta => resolveResource(meta))
          );

          for (const result of results) {
            if (result.status === "fulfilled" && result.value !== null) {
              resolvedResources.push(result.value);
            }
          }

          if (articleCount > 0) {
            sendEvent(controller, "progress", { 
              step: "articles", 
              message: `Found ${resolvedResources.length} resources for this technique` 
            });
          }

          techniques.push({
            title: techniqueMeta.title,
            description: techniqueMeta.description,
            resources: resolvedResources,
            completed: false,
            removed: false,
          });
        }

        // Step 3: Complete
        sendEvent(controller, "progress", { 
          step: "complete", 
          message: "Your learning plan is ready!" 
        });

        // Send the final plan
        sendEvent(controller, "complete", { techniques });

        controller.close();
      } catch (error) {
        console.error("[@generatePlan] Error:", error);
        sendEvent(controller, "error", { message: "Failed to generate plan" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
