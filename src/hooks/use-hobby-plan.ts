"use client";

import { useState, useEffect, useCallback } from "react";
import type { LearningPlan } from "@/lib/schemas";

export interface SavedPlan {
  id: string;
  hobbyName: string;
  hobbyLevel: string;
  plan: LearningPlan;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEYS = {
  PLANS: "hobby-plans",
  CURRENT_PLAN_ID: "current-plan-id",
} as const;

function generateId(): string {
  return `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useHobbyPlan() {
  const [allPlans, setAllPlans] = useState<SavedPlan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load all plans from localStorage
  useEffect(() => {
    const loadedPlans = localStorage.getItem(STORAGE_KEYS.PLANS);
    const loadedCurrentId = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAN_ID);

    if (loadedPlans) {
      try {
        setAllPlans(JSON.parse(loadedPlans));
      } catch {
        setAllPlans([]);
      }
    }
    if (loadedCurrentId) {
      setCurrentPlanId(loadedCurrentId);
    }
    setIsLoaded(true);
  }, []);

  // Get current plan
  const currentPlan = allPlans.find(p => p.id === currentPlanId) || null;
  const plan = currentPlan?.plan || null;
  const hobbyName = currentPlan?.hobbyName || "";
  const hobbyLevel = currentPlan?.hobbyLevel || "";

  // Save a new plan
  const savePlan = useCallback((newPlan: LearningPlan, name: string, level: string) => {
    const id = generateId();
    const savedPlan: SavedPlan = {
      id,
      hobbyName: name,
      hobbyLevel: level,
      plan: newPlan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPlans = [...allPlans, savedPlan];
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(updatedPlans));
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLAN_ID, id);
    
    setAllPlans(updatedPlans);
    setCurrentPlanId(id);
  }, [allPlans]);

  // Select a plan as current
  const selectPlan = useCallback((planId: string) => {
    const planExists = allPlans.some(p => p.id === planId);
    if (planExists) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PLAN_ID, planId);
      setCurrentPlanId(planId);
    }
  }, [allPlans]);

  // Update technique status in current plan
  const updateTechniqueStatus = useCallback((index: number, isCompleted: boolean) => {
    if (!currentPlan) return;
    
    const updatedTechniques = [...currentPlan.plan.techniques];
    updatedTechniques[index] = { 
      ...updatedTechniques[index], 
      completed: isCompleted 
    };
    
    const updatedPlan: SavedPlan = {
      ...currentPlan,
      plan: { ...currentPlan.plan, techniques: updatedTechniques },
      updatedAt: new Date().toISOString(),
    };
    
    const updatedPlans = allPlans.map(p => p.id === currentPlanId ? updatedPlan : p);
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(updatedPlans));
    setAllPlans(updatedPlans);
  }, [currentPlan, currentPlanId, allPlans]);

  // Remove technique from current plan
  const removeTechnique = useCallback((index: number) => {
    if (!currentPlan) return;
    
    const updatedTechniques = [...currentPlan.plan.techniques];
    updatedTechniques[index] = { 
      ...updatedTechniques[index], 
      removed: true 
    };
    
    const updatedPlan: SavedPlan = {
      ...currentPlan,
      plan: { ...currentPlan.plan, techniques: updatedTechniques },
      updatedAt: new Date().toISOString(),
    };
    
    const updatedPlans = allPlans.map(p => p.id === currentPlanId ? updatedPlan : p);
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(updatedPlans));
    setAllPlans(updatedPlans);
  }, [currentPlan, currentPlanId, allPlans]);

  // Delete a plan entirely
  const deletePlan = useCallback((planId: string) => {
    const updatedPlans = allPlans.filter(p => p.id !== planId);
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(updatedPlans));
    
    // If deleting current plan, clear current selection
    if (planId === currentPlanId) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN_ID);
      setCurrentPlanId(null);
    }
    
    setAllPlans(updatedPlans);
  }, [allPlans, currentPlanId]);

  // Clear current plan selection (go back to home)
  const clearCurrentPlan = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN_ID);
    setCurrentPlanId(null);
  }, []);

  return {
    // Current plan data
    plan,
    hobbyName,
    hobbyLevel,
    currentPlanId,
    
    // All plans
    allPlans,
    
    // State
    isLoaded,
    hasPlan: !!currentPlan,
    hasAnyPlans: allPlans.length > 0,
    
    // Actions
    savePlan,
    selectPlan,
    updateTechniqueStatus,
    removeTechnique,
    deletePlan,
    clearCurrentPlan,
  };
}
