"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TechniqueDetailContent } from "@/components/technique-detail-content";
import { TechniqueCard } from "@/components/technique-card";
import { useMediaQuery, useHobbyPlan } from "@/hooks";
import type { Technique } from "@/lib/schemas";

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
  
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isLoaded && !hasPlan) {
      router.push("/");
    }
  }, [isLoaded, hasPlan, router]);

  const onComplete = (index: number) => {
    if (!plan || index === null) return;
    const technique = plan.techniques[index];
    updateTechniqueStatus(index, !technique.completed);
    setSelectedTechnique(null);
    setSelectedIndex(null);
  };

  const onRemove = (index: number) => {
    if (index === null) return;
    removeTechnique(index);
    setSelectedTechnique(null);
    setSelectedIndex(null);
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

  const DetailWrapper = isDesktop ? Dialog : Drawer;
  const DetailContent = isDesktop ? DialogContent : DrawerContent;
  const DetailHeader = isDesktop ? DialogHeader : DrawerHeader;
  const DetailTitle = isDesktop ? DialogTitle : DrawerTitle;
  const DetailDescription = isDesktop ? DialogDescription : DrawerDescription;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 py-8 md:py-12"
    >
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
            return (
              <TechniqueCard
                key={index}
                technique={technique}
                index={index}
                onSelect={() => {
                  setSelectedTechnique(technique);
                  setSelectedIndex(index);
                }}
              />
            );
          })}
        </motion.div>

        <DetailWrapper
          open={!!selectedTechnique}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedTechnique(null);
              setSelectedIndex(null);
            }
          }}
        >
          <DetailContent className={isDesktop ? "" : "max-h-[85vh]"}>
            <DetailHeader>
              <DetailTitle className="text-2xl font-bold leading-tight pr-8">
                {selectedTechnique?.title}
              </DetailTitle>
              <DetailDescription className="text-base text-muted-foreground mt-2">
                Technique Details
              </DetailDescription>
            </DetailHeader>
            {selectedTechnique && selectedIndex !== null && (
              <div className={isDesktop ? "" : "px-4 pb-4 overflow-y-auto"}>
                <TechniqueDetailContent
                  technique={selectedTechnique}
                  onComplete={() => onComplete(selectedIndex)}
                  onRemove={() => onRemove(selectedIndex)}
                />
              </div>
            )}
          </DetailContent>
        </DetailWrapper>
      </div>
    </motion.div>
  );
}
