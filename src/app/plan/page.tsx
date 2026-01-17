"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, X, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TechniqueDetailContent } from "@/components/technique-detail-content";
import { TechniqueCard } from "@/components/technique-card";
import { useHobbyPlan } from "@/hooks";
import type { Technique } from "@/lib/schemas";

import Paper from "@/components/patterns/paper";

export default function PlanPage() {
  const router = useRouter();
  const { 
    plan, 
    hobbyName, 
    hobbyLevel, 
    isLoaded, 
    hasPlan, 
    updateTechniqueStatus, 
    removeTechnique, 
    clearPlan 
  } = useHobbyPlan();
  
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded && !hasPlan) {
      router.push("/");
    }
  }, [isLoaded, hasPlan, router]);

  const onComplete = (index: number) => {
    if (!plan || index === null) return;
    const technique = plan.techniques[index];
    updateTechniqueStatus(index, !technique.completed);
  };

  const onRemove = (index: number) => {
    if (index === null) return;
    removeTechnique(index);
    setExpandedIndex(null);
  };

  const toggleExpand = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  };

  const onReset = () => {
    clearPlan();
    router.push("/");
  };

  if (!isLoaded || !plan) {
    return null;
  }

  const activeTechniques = plan.techniques.filter((t) => !t.removed);
  const completedCount = activeTechniques.filter((t) => t.completed).length;
  const progress = activeTechniques.length > 0
    ? (completedCount / activeTechniques.length) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full px-4 py-8 md:py-12 relative overflow-hidden"
    >
      <div className="fixed inset-0 z-[-1] opacity-60">
        <Paper />
      </div>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold mb-1"
            >
              {hobbyName} Plan
            </motion.h1>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground capitalize text-lg"
            >
              {hobbyLevel} level • {activeTechniques.length} techniques
            </motion.p>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            New Plan
          </Button>
        </div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">
              {completedCount} / {activeTechniques.length} completed
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          {progress === 100 && (
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center text-cr-green font-semibold mt-2"
            >
              Congratulations! You&apos;ve mastered all techniques!
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {plan.techniques.map((technique, index) => {
            if (technique.removed) return null;
            const isExpanded = expandedIndex === index;
            return (
              <div key={index}>
                <TechniqueCard
                  technique={technique}
                  index={index}
                  onSelect={() => toggleExpand(index)}
                  isExpanded={isExpanded}
                />
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      ref={detailRef}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="bg-card border border-t-0 rounded-b-xl p-4 md:p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Technique Details</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedIndex(null)}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                        </div>
                        <TechniqueDetailContent
                          technique={technique}
                          onComplete={() => onComplete(index)}
                          onRemove={() => onRemove(index)}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
