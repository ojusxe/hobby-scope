import { z } from "zod";

/**
 * Schema for search metadata that LLM generates instead of direct URLs
 * This ensures strict separation: LLM generates intent, APIs resolve URLs
 */

export const videoSearchMetaSchema = z.object({
  type: z.literal("video"),
  title: z.string().describe("Descriptive title for the video resource"),
  searchQuery: z.string().describe("Optimized YouTube search query to find this resource"),
  intent: z.string().describe("What the learner should gain from this video"),
  maxDurationMinutes: z.number().optional().describe("Preferred max video duration"),
});

export const articleSearchMetaSchema = z.object({
  type: z.literal("article"),
  title: z.string().describe("Descriptive title for the article resource"),
  searchQuery: z.string().describe("Optimized web search query to find this resource"),
  intent: z.string().describe("What the learner should gain from this article"),
  preferredSources: z.array(z.string()).optional().describe("Preferred domains like 'medium.com', 'wikihow.com'"),
});

export const resourceSearchMetaSchema = z.discriminatedUnion("type", [
  videoSearchMetaSchema,
  articleSearchMetaSchema,
]);

export const techniqueWithSearchMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  resourceSearchMeta: z.array(resourceSearchMetaSchema).min(2).max(3),
});

export const learningPlanSearchMetaSchema = z.object({
  techniques: z.array(techniqueWithSearchMetaSchema).min(5).max(8),
});

export type VideoSearchMeta = z.infer<typeof videoSearchMetaSchema>;
export type ArticleSearchMeta = z.infer<typeof articleSearchMetaSchema>;
export type ResourceSearchMeta = z.infer<typeof resourceSearchMetaSchema>;
export type TechniqueWithSearchMeta = z.infer<typeof techniqueWithSearchMetaSchema>;
export type LearningPlanSearchMeta = z.infer<typeof learningPlanSearchMetaSchema>;
