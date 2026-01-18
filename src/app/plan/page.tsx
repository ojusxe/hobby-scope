"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RotateCcw, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/navbar";
import { TechniqueExpandableCard } from "@/components/technique-expandable-card";
import { useHobbyPlan } from "@/hooks";

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
    clearCurrentPlan,
    allPlans
  } = useHobbyPlan();

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
  };

  const onReset = () => {
    clearCurrentPlan();
    router.push("/create");
  };

  const goToAllPlans = () => {
    router.push("/plans");
  };

  if (!isLoaded || !plan) {
    return null;
  }

  const activeTechniques = plan.techniques.filter((t) => !t.removed);
  const completedCount = activeTechniques.filter((t) => t.completed).length;
  const progress = activeTechniques.length > 0
    ? (completedCount / activeTechniques.length) * 100
    : 0;

  // Track step numbers for non-removed techniques
  let stepNumber = 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full px-4 pt-20 pb-8 md:pb-12 relative overflow-hidden"
    >
      <Navbar />
      <div className="fixed inset-0 z-[-1] opacity-60">
        <Paper />
      </div>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl sm:text-3xl font-bold mb-1"
              >
                {hobbyName} Plan
              </motion.h1>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground capitalize"
              >
                {hobbyLevel} level • {activeTechniques.length} techniques
              </motion.p>
            </div>
          </div>

          <div className="space-y-2">
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
                🎉 Congratulations! You&apos;ve mastered all techniques!
              </motion.p>
            )}
          </div>
        </div>

        {/* Techniques List */}
        <div className="space-y-3">
          {plan.techniques.map((technique, index) => {
            if (technique.removed) return null;
            stepNumber++;
            const currentStep = stepNumber;
            
            return (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <TechniqueExpandableCard
                  technique={technique}
                  index={index}
                  stepNumber={currentStep}
                  onComplete={onComplete}
                  onRemove={onRemove}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
