"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useHobbyPlan } from "@/hooks";
import {
  Target,
  ChevronRight,
  Zap,
  Trophy,
} from "lucide-react";

import { LandingDecorations } from "@/components/landing-decorations";
import Stars from "@/components/patterns/stars";

export default function LandingPage() {
  const router = useRouter();
  const { hasPlan, isLoaded } = useHobbyPlan();

  useEffect(() => {
    if (isLoaded && hasPlan) {
      router.push("/plan");
    }
  }, [router, isLoaded, hasPlan]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden bg-[#090a0f]"
    >
      <div className="fixed inset-0 z-0">
        <Stars />
      </div>
      
      <LandingDecorations />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 text-center max-w-2xl"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
             <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-white uppercase font-display">
            --Hobby Scope--
          </h2>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-cr-green"
        >
          Get better at your hobby{" "}
          <span className="block text-white">Without Overwhelm</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-white/70 mb-8 max-w-md mx-auto"
        >
          Get a focused 5-8 technique plan tailored to your level. No more
          endless YouTube rabbit holes.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="lg"
            onClick={() => router.push("/create")}
            className="bg-cr-green hover:bg-cr-green/90 text-primary font-semibold px-8 py-6 text-lg rounded-xl pulse-glow"
          >
            Start Learning
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex items-center justify-center gap-8 text-white/60 text-sm"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cr-green" />
            <span>Focused Plans</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cr-green" />
            <span>Quick Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-cr-green" />
            <span>Track Mastery</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
