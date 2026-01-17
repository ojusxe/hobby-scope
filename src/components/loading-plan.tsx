"use client";

import { motion } from "framer-motion";
import PacmanLoader from "@/components/patterns/pacman-loader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Paper from "@/components/patterns/paper";
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
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden"
    >
      <div className="fixed inset-0 z-[-1] opacity-60">
        <Paper />
      </div>
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <PacmanLoader />
          </div>
          <h2 className="text-2xl font-bold mb-2">Creating Your Plan...</h2>
          <p className="text-muted-foreground">
            Crafting {hobby} techniques for {level} level
          </p>
        </div>

        <div className="space-y-4">
          {partialData?.techniques?.map((technique, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden border-cr-green/50">
                <CardHeader className="pb-2">
                  {technique?.title ? (
                    <h3 className="font-semibold text-lg">{technique.title}</h3>
                  ) : (
                    <Skeleton className="h-5 w-3/4" />
                  )}
                </CardHeader>
                <CardContent>
                  {technique?.description ? (
                    <p className="text-sm text-muted-foreground">{technique.description}</p>
                  ) : (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {(!partialData?.techniques || partialData.techniques.length < 3) &&
            [...Array(3 - (partialData?.techniques?.length || 0))].map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="overflow-hidden opacity-50">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-1/2" />
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
