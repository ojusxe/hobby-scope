"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, ChevronRight, Play, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Technique } from "@/lib/schemas";

// Extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

interface TechniqueExpandableCardProps {
  technique: Technique;
  index: number;
  stepNumber: number;
  onComplete: (index: number) => void;
  onRemove: (index: number) => void;
}

export function TechniqueExpandableCard({
  technique,
  index,
  stepNumber,
  onComplete,
  onRemove,
}: TechniqueExpandableCardProps) {
  const [active, setActive] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(false);
      }
    };

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setActive(false);
      }
    };

    if (active) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [active]);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Expanded Modal View */}
      <AnimatePresence mode="wait">
        {active && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6">
            <motion.div
              ref={cardRef}
              layoutId={`card-${index}-${id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-white rounded-2xl shadow-2xl">
            
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <motion.div
                      layoutId={`step-${index}-${id}`}
                      className={cn(
                        "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold",
                        technique.completed
                          ? "bg-cr-green text-white"
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {technique.completed ? <Check className="w-6 h-6" /> : stepNumber}
                    </motion.div>
                    <div>
                      <motion.p
                        layoutId={`label-${index}-${id}`}
                        className="text-sm text-gray-500 mb-1"
                      >
                        {technique.completed ? "✓ Completed" : `Step ${stepNumber}`}
                      </motion.p>
                      <motion.h2
                        layoutId={`title-${index}-${id}`}
                        className={cn(
                          "text-2xl font-bold",
                          technique.completed ? "text-cr-green" : "text-gray-900"
                        )}
                      >
                        {technique.title}
                      </motion.h2>
                    </div>
                  </div>
                  <motion.button
                    layoutId={`button-${index}-${id}`}
                    aria-label="Close"
                    onClick={() => setActive(false)}
                    className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 space-y-6"
              >
                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    About this technique
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {technique.description}
                  </p>
                </div>

                {/* Resources */}
                {technique.resources && technique.resources.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                      Learning Resources
                    </h3>
                    <div className="space-y-4">
                      {technique.resources.map((resource, idx) => {
                        const youtubeId = resource.type === "video" ? getYouTubeVideoId(resource.url) : null;
                        
                        if (youtubeId) {
                          // YouTube embed
                          return (
                            <div key={idx} className="rounded-xl overflow-hidden border border-gray-200">
                              <div className="aspect-video">
                                <iframe
                                  src={`https://www.youtube.com/embed/${youtubeId}`}
                                  title={resource.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="w-full h-full"
                                />
                              </div>
                              <div className="p-3 bg-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Play className="w-4 h-4 text-red-600 flex-shrink-0" />
                                  <p className="font-medium text-gray-900 text-sm truncate">
                                    {resource.title}
                                  </p>
                                </div>
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-shrink-0 text-gray-500 hover:text-cr-green transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          );
                        }
                        
                        // Regular link for articles and non-YouTube videos
                        return (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-cr-green/50 hover:bg-cr-green/5 transition-all group"
                          >
                            <div
                              className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                resource.type === "video"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-blue-100 text-blue-600"
                              )}
                            >
                              {resource.type === "video" ? (
                                <Play className="w-6 h-6" />
                              ) : (
                                <FileText className="w-6 h-6" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 group-hover:text-cr-green transition-colors">
                                {resource.title}
                              </p>
                              <p className="text-sm text-gray-500 capitalize">
                                {resource.type}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cr-green transition-colors" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => {
                      onComplete(index);
                      setActive(false);
                    }}
                    className={cn(
                      "flex-1 h-12",
                      technique.completed
                        ? "bg-cr-green/10 text-cr-green hover:bg-cr-green/20 border-cr-green/30"
                        : "bg-cr-green hover:bg-cr-green/90 text-white"
                    )}
                    variant={technique.completed ? "outline" : "default"}
                  >
                    <Check className="w-5 h-5 mr-2" />
                    {technique.completed ? "Completed!" : "Mark as Complete"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onRemove(index);
                      setActive(false);
                    }}
                    className="h-12 text-destructive hover:bg-destructive/10 border-destructive/30"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Remove
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Collapsed Card View */}
      <motion.div
        layoutId={`card-${index}-${id}`}
        onClick={() => setActive(true)}
        className={cn(
          "bg-white rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow-md",
          technique.completed ? "border-cr-green/50" : "border-gray-200"
        )}
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <motion.div
              layoutId={`step-${index}-${id}`}
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                technique.completed
                  ? "bg-cr-green text-white"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              {technique.completed ? <Check className="w-4 h-4" /> : stepNumber}
            </motion.div>

            <div className="flex-1 min-w-0">
              <motion.p
                layoutId={`label-${index}-${id}`}
                className="text-xs text-gray-500 mb-0.5"
              >
                {technique.completed ? "✓ Completed" : `Step ${stepNumber}`}
              </motion.p>
              <motion.h3
                layoutId={`title-${index}-${id}`}
                className={cn(
                  "font-semibold text-lg",
                  technique.completed ? "text-cr-green" : "text-gray-900"
                )}
              >
                {technique.title}
              </motion.h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {technique.description}
              </p>

              {/* Resource badges */}
              {technique.resources && technique.resources.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {technique.resources.map((resource, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                    >
                      {resource.type === "video" ? (
                        <Play className="w-3 h-3" />
                      ) : (
                        <FileText className="w-3 h-3" />
                      )}
                      {resource.type}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <motion.div
              layoutId={`button-${index}-${id}`}
              className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
