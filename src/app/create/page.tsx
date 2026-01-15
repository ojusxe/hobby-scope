"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingPlan } from "@/components/loading-plan";
import { learningPlanSchema, type Resource } from "@/lib/schemas";
import { LEVELS, HOBBY_SUGGESTIONS } from "@/lib/constants";
import { useHobbyPlan } from "@/hooks";
import { Sparkles } from "lucide-react";

export default function CreatePage() {
  const router = useRouter();
  const { savePlan } = useHobbyPlan();
  const [hobby, setHobby] = useState("");
  const [level, setLevel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { object, submit } = useObject({
    api: "/api/generate-plan",
    schema: learningPlanSchema,
    onFinish: ({ object }) => {
      if (object) {
        const planWithState = {
          techniques: object.techniques.map((t: { title: string; description: string; resources: Resource[] }) => ({
            ...t,
            completed: false,
            removed: false,
          })),
        };
        savePlan(planWithState, hobby, level);
        router.push("/plan");
      }
    },
    onError: () => {
      setError("Failed to generate plan. Please try again.");
      setIsLoading(false);
    },
  });

  const handleGenerate = () => {
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
    submit({ hobby, level });
  };

  if (isLoading) {
    return <LoadingPlan hobby={hobby} level={level} partialData={object as any} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold mb-2"
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
              className="h-12 text-lg rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {HOBBY_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setHobby(suggestion)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                  hobby === suggestion
                    ? "bg-cr-green text-primary font-medium"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {suggestion}
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
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  level === lvl.id
                    ? "border-cr-green bg-cr-green/10"
                    : "border-border hover:border-cr-green/50"
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
