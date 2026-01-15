import { Rocket, Zap, Trophy } from "lucide-react";

export const LEVELS = [
  { id: "beginner", label: "Beginner", icon: Rocket, description: "Just starting out" },
  { id: "intermediate", label: "Intermediate", icon: Zap, description: "Know the basics" },
  { id: "advanced", label: "Advanced", icon: Trophy, description: "Ready for mastery" },
] as const;

export const HOBBY_SUGGESTIONS = [
  "Chess", "Guitar", "Photography", "Cooking", "Drawing", "Poker",
  "Piano", "Coding", "Yoga", "Gardening", "Writing", "Dancing",
] as const;
