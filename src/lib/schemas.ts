import { z } from "zod";

export const resourceSchema = z.object({
  type: z.enum(["video", "article", "audio"]),
  title: z.string(),
});

export const techniqueSchema = z.object({
  title: z.string(),
  description: z.string(),
  resources: z.array(resourceSchema),
});

export const learningPlanSchema = z.object({
  techniques: z.array(techniqueSchema),
});

export type Resource = z.infer<typeof resourceSchema>;

export type Technique = z.infer<typeof techniqueSchema> & {
  completed?: boolean;
  removed?: boolean;
};

export type LearningPlan = {
  techniques: Technique[];
};

export type AppStep = "landing" | "input" | "loading" | "plan";
