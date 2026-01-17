"use client";

import { useState, useEffect } from "react";
import { ExternalLink, FileText, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticleMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

interface ArticlePreviewProps {
  url: string;
  title: string;
}

export function ArticlePreview({ url, title }: ArticlePreviewProps) {
  const [metadata, setMetadata] = useState<ArticleMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch metadata from the URL
    const fetchMetadata = async () => {
      try {
        // Use a proxy or API to fetch metadata (you might want to create an API route for this)
        // For now, we'll just show the basic info
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

  const domain = url ? new URL(url).hostname.replace("www.", "") : "";

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-0">
        {metadata?.image && !loading && !error ? (
          <div className="aspect-video w-full bg-cover bg-center" style={{ backgroundImage: `url(${metadata.image})` }} />
        ) : null}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-blue-600/10 text-blue-600 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              {loading ? (
                <>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4 mb-2" />
                </>
              ) : (
                <>
                  <h4 className="font-semibold text-sm mb-1 line-clamp-2">{metadata?.title || title}</h4>
                  {metadata?.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{metadata.description}</p>
                  )}
                </>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Globe className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">{domain}</span>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
              >
                Read article
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
