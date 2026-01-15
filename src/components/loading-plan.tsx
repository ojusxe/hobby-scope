"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LearningPlan } from "@/lib/schemas";

interface LoadingPlanProps {
  hobby: string;
  level: string;
  partialData?: Partial<LearningPlan>;
}

export function LoadingPlan({ hobby, level, partialData }: LoadingPlanProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-cr-green" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Creating Your Plan...</h2>
          <p className="text-muted-foreground">
            Crafting {hobby} techniques for {level} level
          </p>
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {partialData?.techniques && partialData.techniques.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-muted-foreground"
          >
            Generated {partialData.techniques.length} techniques...
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
