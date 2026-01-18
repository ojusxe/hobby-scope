"use client";

import { motion, AnimatePresence } from "framer-motion";
import PacmanLoader from "@/components/pacman-loader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import Paper from "@/components/patterns/paper";

interface LoadingPlanProps {
  hobby: string;
  level: string;
  progressMessage?: string;
  progressPercent?: number;
}

export function LoadingPlan({ hobby, level, progressMessage, progressPercent = 0 }: LoadingPlanProps) {
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
          
          {/* Progress section */}
          <div className="mt-6 space-y-3">
            <AnimatePresence mode="wait">
              <motion.p
                key={progressMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-medium text-foreground min-h-[1.5rem]"
              >
                {progressMessage || "Initializing..."}
              </motion.p>
            </AnimatePresence>
            
            {progressPercent > 0 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                className="w-full max-w-xs mx-auto"
              >
                <Progress value={progressPercent} className="h-2" />
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`skeleton-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: i * 0.2 }}
            >
              <Card className="overflow-hidden">
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
      </div>
    </motion.div>
  );
}
