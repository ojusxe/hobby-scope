import type { VideoSearchMeta } from "./search-schemas";
import type { Resource } from "./schemas";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
  };
}

interface YouTubeSearchResponse {
  items?: YouTubeSearchItem[];
}

/**
 * Search YouTube for videos matching the search metadata
 * Returns embeddable videos with short duration, ordered by relevance
 */
export async function searchYouTube(meta: VideoSearchMeta): Promise<Resource | null> {
  if (!YOUTUBE_API_KEY) {
    console.warn("[YouTube] API key not configured, skipping video search");
    return null;
  }

  try {
    const params = new URLSearchParams({
      part: "snippet",
      q: meta.searchQuery,
      type: "video",
      videoEmbeddable: "true",
      maxResults: "5",
      order: "relevance",
      key: YOUTUBE_API_KEY,
    });

    // Add duration filter if specified
    if (meta.maxDurationMinutes) {
      if (meta.maxDurationMinutes <= 4) {
        params.set("videoDuration", "short"); // < 4 min
      } else if (meta.maxDurationMinutes <= 20) {
        params.set("videoDuration", "medium"); // 4-20 min
      }
      // For longer videos, don't filter by duration
    }

    const response = await fetch(`${YOUTUBE_SEARCH_URL}?${params}`);
    
    if (!response.ok) {
      console.error("[YouTube] API error:", response.status, await response.text());
      return null;
    }

    const data: YouTubeSearchResponse = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.warn("[YouTube] No results for query:", meta.searchQuery);
      return null;
    }

    // Get the first valid result
    const video = data.items[0];
    const videoId = video.id.videoId;
    
    // Validate the video is accessible
    const isValid = await validateYouTubeVideo(videoId);
    if (!isValid) {
      // Try next result
      for (let i = 1; i < data.items.length; i++) {
        const altVideo = data.items[i];
        if (await validateYouTubeVideo(altVideo.id.videoId)) {
          return {
            type: "video",
            title: meta.title || altVideo.snippet.title,
            url: `https://www.youtube.com/watch?v=${altVideo.id.videoId}`,
          };
        }
      }
      return null;
    }

    return {
      type: "video",
      title: meta.title || video.snippet.title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  } catch (error) {
    console.error("[YouTube] Search error:", error);
    return null;
  }
}

/**
 * Validate that a YouTube video is accessible and embeddable
 */
async function validateYouTubeVideo(videoId: string): Promise<boolean> {
  try {
    // Use oEmbed endpoint for quick validation (no API key needed)
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Build YouTube embed URL from video ID
 */
export function buildYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}
