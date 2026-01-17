import type { ArticleSearchMeta } from "./search-schemas";
import type { Resource } from "./schemas";

const SERPER_API_KEY = process.env.SERPER_API_KEY;
const SERPER_API_URL = "https://google.serper.dev/search";

// Reputable domains for learning content
const REPUTABLE_DOMAINS = [
  "medium.com",
  "wikihow.com",
  "instructables.com",
  "skillshare.com",
  "masterclass.com",
  "udemy.com",
  "coursera.org",
  "edx.org",
  "khanacademy.org",
  "wikipedia.org",
  "britannica.com",
  "howstuffworks.com",
  "lifehacker.com",
  "makeuseof.com",
  "thespruce.com",
  "allrecipes.com",
  "seriouseats.com",
  "dpreview.com",
  "petapixel.com",
];

interface SerperOrganicResult {
  title: string;
  link: string;
  snippet?: string;
  position: number;
}

interface SerperSearchResponse {
  organic?: SerperOrganicResult[];
  searchParameters?: {
    q: string;
  };
}

/**
 * Search for articles using Serper.dev (Google Search API)
 * Prioritizes reputable learning sources
 */
export async function searchArticle(meta: ArticleSearchMeta): Promise<Resource | null> {
  if (!SERPER_API_KEY) {
    console.warn("[Serper] API key not configured, skipping article search");
    return null;
  }

  try {
    // Build search query with site restrictions if preferred sources specified
    let query = meta.searchQuery;
    if (meta.preferredSources && meta.preferredSources.length > 0) {
      const siteQuery = meta.preferredSources.map(s => `site:${s}`).join(" OR ");
      query = `${query} (${siteQuery})`;
    }

    const response = await fetch(SERPER_API_URL, {
      method: "POST",
      headers: {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        num: 10,
      }),
    });

    if (!response.ok) {
      console.error("[Serper] API error:", response.status, await response.text());
      return null;
    }

    const data: SerperSearchResponse = await response.json();

    if (!data.organic || data.organic.length === 0) {
      console.warn("[Serper] No results for:", meta.searchQuery);
      return null;
    }

    // Find first result from reputable source or any valid result
    for (const result of data.organic) {
      const domain = extractDomain(result.link);
      const isReputable = REPUTABLE_DOMAINS.some(d => domain.includes(d)) ||
                         (meta.preferredSources && meta.preferredSources.some(s => domain.includes(s)));
      
      // Use reputable sources first, otherwise take from top 3 results
      if (isReputable || result.position <= 3) {
        const isValid = await validateUrl(result.link);
        if (isValid) {
          return {
            type: "article",
            title: meta.title || result.title,
            url: result.link,
          };
        }
      }
    }

    // Fallback: return first valid result regardless of domain
    for (const result of data.organic) {
      const isValid = await validateUrl(result.link);
      if (isValid) {
        return {
          type: "article",
          title: meta.title || result.title,
          url: result.link,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("[Serper] Search error:", error);
    return null;
  }
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

/**
 * Validate URL is accessible and returns proper content
 */
async function validateUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    
    clearTimeout(timeout);

    if (!response.ok) return false;

    // Check content type is HTML
    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.includes("text/html")) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
