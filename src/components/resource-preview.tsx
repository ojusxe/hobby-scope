"use client";

import { ExternalLink, Play, FileText, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ResourceIcon } from "@/components/resource-icon";
import { getYouTubeVideoId, getYouTubeThumbnail, isYouTubeUrl } from "@/lib/youtube";
import type { Resource } from "@/lib/schemas";
import { useState } from "react";

interface ResourcePreviewProps {
  resource: Resource;
}

export function ResourcePreview({ resource }: ResourcePreviewProps) {
  const [showEmbed, setShowEmbed] = useState(false);
  const isYouTube = isYouTubeUrl(resource.url);
  const videoId = isYouTube ? getYouTubeVideoId(resource.url) : null;

  if (isYouTube && videoId) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="relative group">
            {showEmbed ? (
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={resource.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <>
                <div
                  className="aspect-video w-full bg-cover bg-center cursor-pointer relative"
                  style={{
                    backgroundImage: `url(${getYouTubeThumbnail(videoId, 'high')})`,
                  }}
                  onClick={() => setShowEmbed(true)}
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-red-600/10 text-red-600 flex-shrink-0">
                      <ResourceIcon type="video" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-2">{resource.title}</h4>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Watch on YouTube
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Article preview
  if (resource.type === "article") {
    const domain = resource.url ? new URL(resource.url).hostname.replace("www.", "") : "";
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-blue-600/10 text-blue-600 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1 line-clamp-2">{resource.title}</h4>
              <p className="text-xs text-muted-foreground mb-2 truncate">{domain}</p>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Read article
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Audio preview
  if (resource.type === "audio") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-purple-600/10 text-purple-600 flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1 line-clamp-2">{resource.title}</h4>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-2"
              >
                Listen
                <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-xs text-muted-foreground mt-1 truncate">{resource.url}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fallback for other types
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-accent/20 text-accent flex-shrink-0">
            <ResourceIcon type={resource.type} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1">{resource.title}</h4>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-2"
            >
              Open link
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
