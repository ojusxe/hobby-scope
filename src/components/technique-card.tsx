"use client";

import { motion } from "framer-motion";
import { Check, ChevronRight, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceIcon } from "@/components/resource-icon";
import type { Technique } from "@/lib/schemas";

interface TechniqueCardProps {
  technique: Technique;
  index: number;
  onSelect: () => void;
  isExpanded?: boolean;
}

export function TechniqueCard({ technique, index, onSelect, isExpanded }: TechniqueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      layout
    >
      <Card
        className={`cursor-pointer transition-all hover:shadow-md ${
          technique.completed
            ? "border-cr-green/50 bg-cr-green/5"
            : "hover:border-cr-green/30"
        } ${isExpanded ? "rounded-b-none border-b-0" : ""}`}
        onClick={onSelect}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  technique.completed
                    ? "bg-cr-green text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {technique.completed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={
                  technique.completed ? "line-through opacity-70" : ""
                }
              >
                {technique.title}
              </span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {technique.description}
          </p>
          <div className="flex gap-2">
            {technique.resources.slice(0, 2).map((resource, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded"
              >
                <span className="w-3 h-3">
                  <ResourceIcon type={resource.type} />
                </span>
                <span className="truncate max-w-[100px]">
                  {resource.type}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
