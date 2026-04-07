"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingPlan } from "@/components/loading-plan";
import { Navbar } from "@/components/navbar";
import { type Resource } from "@/lib/schemas";
import { LEVELS, HOBBY_SUGGESTIONS } from "@/lib/constants";
import { useHobbyPlan } from "@/hooks";
import { Sparkles } from "lucide-react";

import Paper from "@/components/patterns/paper";

export default function CreatePage() {
  const router = useRouter();
  const { savePlan } = useHobbyPlan();
  const [hobby, setHobby] = useState("");
  const [level, setLevel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);

  const handleGenerate = async () => {
    if (!hobby.trim()) {
      setError("Please enter a hobby");
      return;
    }
    if (!level) {
      setError("Please select a level");
      return;
    }
    setError(null);
    setIsLoading(true);
    setProgressMessage("Initializing...");
    setProgressPercent(0);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hobby, level }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to read response");
      }

      let buffer = "";
      let currentEvent = "";
      let didComplete = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7);
          } else if (line.startsWith("data: ") && currentEvent) {
            try {
              const data = JSON.parse(line.slice(6));

              if (currentEvent === "progress") {
                setProgressMessage(data.message);
                
                // Calculate progress percentage
                if (data.step === "ai") {
                  setProgressPercent(10);
                } else if (data.step === "ai-fallback") {
                  setProgressPercent(15);
                } else if (data.step === "ai-complete") {
                  setProgressPercent(25);
                } else if (data.step === "technique" && data.current && data.total) {
                  // Progress from 25% to 90% based on technique resolution
                  const techniqueProgress = (data.current / data.total) * 65;
                  setProgressPercent(25 + techniqueProgress);
                } else if (data.step === "complete") {
                  setProgressPercent(100);
                }
              } else if (currentEvent === "complete") {
                const planWithState = {
                  techniques: data.techniques.map((t: { title: string; description: string; resources: Resource[] }) => ({
                    ...t,
                    completed: false,
                    removed: false,
                  })),
                };
                
                savePlan(planWithState, hobby, level);
                didComplete = true;
                router.push("/plan");
                return;
              } else if (currentEvent === "error") {
                throw new Error(data.message);
              }
              
              currentEvent = "";
            } catch {
              // Ignore JSON parse errors for partial data
            }
          }
        }
      }

      // If the stream ended without an explicit completion event,
      // treat it as a failed generation and release the loading UI.
      if (!didComplete) {
        throw new Error("Generation stream ended before completion");
      }
    } catch (err) {
      console.error("[@createPage] Error:", err);
      setError("Failed to generate plan. Please try again.");
      setIsLoading(false);
      setProgressMessage("");
      setProgressPercent(0);
    }
  };

  if (isLoading) {
    return (
      <LoadingPlan 
        hobby={hobby} 
        level={level} 
        progressMessage={progressMessage}
        progressPercent={progressPercent}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 pt-20 relative overflow-hidden"
    >
      <Navbar />
      <div className="fixed inset-0 z-[-1] opacity-60">
        <Paper />
      </div>
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl font-bold mb-2"
          >
            What do you want to learn?
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Enter your hobby and we&apos;ll create a personalized plan
          </motion.p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div>
            <label className="text-sm font-medium mb-2 block">Your Hobby</label>
            <Input
              placeholder="e.g., Chess, Guitar, Photography..."
              value={hobby}
              onChange={(e) => setHobby(e.target.value)}
              className="h-12 text-lg rounded-xl bg-white border-gray-200"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {HOBBY_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.name}
                onClick={() => setHobby(suggestion.name)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all border flex items-center gap-1.5 ${
                  hobby === suggestion.name
                    ? "bg-cr-green text-primary font-medium border-cr-green"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                }`}
              >
                {suggestion.image && (
                  <Image
                    src={suggestion.image}
                    alt=""
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                )}
                {suggestion.name}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <label className="text-sm font-medium block">Your Level</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setLevel(lvl.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left bg-white ${
                  level === lvl.id
                    ? "border-cr-green bg-cr-green/5"
                    : "border-gray-200 hover:border-cr-green/50"
                }`}
              >
                <lvl.icon
                  className={`w-6 h-6 mb-2 ${
                    level === lvl.id ? "text-cr-green" : "text-muted-foreground"
                  }`}
                />
                <p className="font-semibold">{lvl.label}</p>
                <p className="text-sm text-muted-foreground">{lvl.description}</p>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!hobby.trim() || !level}
            className="w-full h-14 text-lg bg-cr-green hover:bg-cr-green/90 text-primary font-semibold rounded-xl disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate My Plan
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
