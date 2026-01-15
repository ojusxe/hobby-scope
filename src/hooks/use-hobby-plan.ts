"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { LearningPlan } from "@/lib/schemas";

const STORAGE_KEYS = {
  PLAN: "hobby-plan",
  HOBBY: "hobby-name",
  LEVEL: "hobby-level",
} as const;

export function useHobbyPlan() {
  const router = useRouter();
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [hobbyName, setHobbyName] = useState<string>("");
  const [hobbyLevel, setHobbyLevel] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadedPlan = localStorage.getItem(STORAGE_KEYS.PLAN);
    const loadedHobby = localStorage.getItem(STORAGE_KEYS.HOBBY);
    const loadedLevel = localStorage.getItem(STORAGE_KEYS.LEVEL);

    if (loadedPlan) setPlan(JSON.parse(loadedPlan));
    if (loadedHobby) setHobbyName(JSON.parse(loadedHobby));
    if (loadedLevel) setHobbyLevel(JSON.parse(loadedLevel));
    setIsLoaded(true);
  }, []);

  const savePlan = useCallback((newPlan: LearningPlan, name: string, level: string) => {
    localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(newPlan));
    localStorage.setItem(STORAGE_KEYS.HOBBY, JSON.stringify(name));
    localStorage.setItem(STORAGE_KEYS.LEVEL, JSON.stringify(level));
    
    setPlan(newPlan);
    setHobbyName(name);
    setHobbyLevel(level);
  }, []);

  const updateTechniqueStatus = useCallback((index: number, isCompleted: boolean) => {
    if (!plan) return;
    
    const updatedTechniques = [...plan.techniques];
    updatedTechniques[index] = { 
      ...updatedTechniques[index], 
      completed: isCompleted 
    };
    
    const updatedPlan = { ...plan, techniques: updatedTechniques };
    
    setPlan(updatedPlan);
    localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(updatedPlan));
  }, [plan]);

  const removeTechnique = useCallback((index: number) => {
    if (!plan) return;
    
    const updatedTechniques = [...plan.techniques];
    updatedTechniques[index] = { 
      ...updatedTechniques[index], 
      removed: true 
    };
    
    const updatedPlan = { ...plan, techniques: updatedTechniques };
    
    setPlan(updatedPlan);
    localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(updatedPlan));
  }, [plan]);

  const clearPlan = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.PLAN);
    localStorage.removeItem(STORAGE_KEYS.HOBBY);
    localStorage.removeItem(STORAGE_KEYS.LEVEL);
    setPlan(null);
    setHobbyName("");
    setHobbyLevel("");
  }, []);

  return {
    plan,
    hobbyName,
    hobbyLevel,
    isLoaded,
    hasPlan: !!plan,
    savePlan,
    updateTechniqueStatus,
    removeTechnique,
    clearPlan,
  };
}
