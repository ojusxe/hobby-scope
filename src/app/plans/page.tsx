"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Trash2, ArrowRight, FolderOpen, Plus } from "lucide-react";
import styled from "styled-components";

import { Navbar } from "@/components/navbar";
import Paper from "@/components/patterns/paper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useHobbyPlan, SavedPlan } from "@/hooks";

const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
`;

const BackgroundWrapper = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
`;

export default function PlansPage() {
  const router = useRouter();
  const { allPlans, selectPlan, deletePlan } = useHobbyPlan();
  const [mounted, setMounted] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectPlan = (plan: SavedPlan) => {
    selectPlan(plan.id);
    router.push("/plan");
  };

  const handleDeletePlan = (id: string) => {
    deletePlan(id);
    setPlanToDelete(null);
  };

  const getProgress = (plan: SavedPlan) => {
    const techniques = plan.plan.techniques;
    const completed = techniques.filter(t => t.completed).length;
    return Math.round((completed / techniques.length) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <PageWrapper>
      <BackgroundWrapper>
        <Paper />
      </BackgroundWrapper>
      
      <Navbar />

      <div className="relative z-10 pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6"
          >
            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">
              My Learning Plans
            </h1>
            <p className="text-muted-foreground">
              View and manage all your hobby learning plans
            </p>
          </motion.div>

          {allPlans.length === 0 ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm text-center py-16 px-6"
            >
              <FolderOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                No plans yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Start your learning journey by creating your first plan
              </p>
              <Button
                onClick={() => router.push("/create")}
                className="bg-cr-green hover:bg-cr-green/90 text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Plan
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {allPlans.map((savedPlan, index) => {
                  const progress = getProgress(savedPlan);
                  const techniqueCount = savedPlan.plan.techniques.length;
                  const completedCount = savedPlan.plan.techniques.filter(
                    t => t.completed
                  ).length;

                  return (
                    <motion.div
                      key={savedPlan.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => handleSelectPlan(savedPlan)}>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-gray-900 text-xl flex items-center gap-2">
                                {savedPlan.hobbyName}
                                <span className="text-xs font-normal px-2 py-1 rounded-full bg-cr-green/10 text-cr-green border border-cr-green/20 capitalize">
                                  {savedPlan.hobbyLevel}
                                </span>
                              </CardTitle>
                              <div className="flex items-center gap-4 text-muted-foreground text-sm mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(savedPlan.createdAt)}
                                </span>
                                <span>
                                  {completedCount} / {techniqueCount} techniques
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPlanToDelete(savedPlan.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-cr-green text-black hover:bg-cr-green/90 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectPlan(savedPlan);
                                }}
                              >
                                Continue
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="text-cr-green font-medium">{progress}%</span>
                            </div>
                            <Progress 
                              value={progress} 
                              className="h-2"
                            />
                          </div>
                          
                          {/* Techniques preview */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            {savedPlan.plan.techniques.slice(0, 5).map((technique, i) => (
                              <span
                                key={i}
                                className={`text-xs px-2 py-1 rounded-full ${
                                  technique.completed
                                    ? "bg-cr-green/10 text-cr-green"
                                    : technique.removed
                                      ? "bg-red-50 text-red-400 line-through"
                                      : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {technique.title}
                              </span>
                            ))}
                            {savedPlan.plan.techniques.length > 5 && (
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                                +{savedPlan.plan.techniques.length - 5} more
                              </span>
                            )}
                          </div>
                        </CardContent>  
                      </Card>

                      <AnimatePresence>
                        {planToDelete === savedPlan.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-2">
                              <p className="text-gray-700 text-sm mb-3">
                                Are you sure you want to delete &quot;{savedPlan.hobbyName}&quot;? This cannot be undone.
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPlanToDelete(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePlan(savedPlan.id);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
