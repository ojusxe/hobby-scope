import { searchYouTube } from "./youtube-search";
import { searchArticle } from "./article-search";
import type { 
  ResourceSearchMeta, 
  TechniqueWithSearchMeta,
  LearningPlanSearchMeta 
} from "./search-schemas";
import type { Resource, Technique, LearningPlan } from "./schemas";

/**
 * Resolve a single resource search metadata to an actual resource
 * Returns null if resolution fails (graceful degradation)
 */
export async function resolveResource(meta: ResourceSearchMeta): Promise<Resource | null> {
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

/**
 * Resolve all resources for a technique
 * Filters out failed resolutions (graceful degradation)
 */
export async function resolveTechniqueResources(
  technique: TechniqueWithSearchMeta
): Promise<Technique> {
  const resolvedResources: Resource[] = [];

  // Resolve resources in parallel for efficiency
  const results = await Promise.allSettled(
    technique.resourceSearchMeta.map(meta => resolveResource(meta))
  );

  for (const result of results) {
    if (result.status === "fulfilled" && result.value !== null) {
      resolvedResources.push(result.value);
    }
  }

  return {
    title: technique.title,
    description: technique.description,
    resources: resolvedResources,
    completed: false,
    removed: false,
  };
}

/**
 * Resolve all resources in a learning plan
 * Processes techniques sequentially to avoid rate limits
 * but resources within each technique in parallel
 */
export async function resolveLearningPlan(
  plan: LearningPlanSearchMeta
): Promise<LearningPlan> {
  const techniques: Technique[] = [];

  for (const techniqueMeta of plan.techniques) {
    const resolvedTechnique = await resolveTechniqueResources(techniqueMeta);
    
    // Only include techniques that have at least one resolved resource
    if (resolvedTechnique.resources.length > 0) {
      techniques.push(resolvedTechnique);
    } else {
      // Include technique with empty resources rather than dropping it entirely
      // This allows the plan structure to remain intact
      console.warn(`[ResourceResolver] No resources resolved for technique: ${techniqueMeta.title}`);
      techniques.push(resolvedTechnique);
    }
  }

  return { techniques };
}

/**
 * Validate that a resolved learning plan has sufficient content
 */
export function validateResolvedPlan(plan: LearningPlan): boolean {
  // Ensure we have at least 3 techniques with resources
  const techniquesWithResources = plan.techniques.filter(t => t.resources.length > 0);
  return techniquesWithResources.length >= 3;
}
