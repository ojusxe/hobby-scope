import { Rocket, Zap, Trophy } from "lucide-react";

export const LEVELS = [
  { id: "beginner", label: "Beginner", icon: Rocket, description: "Just starting out" },
  { id: "intermediate", label: "Intermediate", icon: Zap, description: "Know the basics" },
  { id: "advanced", label: "Advanced", icon: Trophy, description: "Ready for mastery" },
] as const;

export const HOBBY_SUGGESTIONS = [
  { name: "Chess", image: null },
  { name: "Guitar", image: null },
  { name: "Photography", image: null },
  { name: "Cooking", image: "/hobbyist-otis/cooking.png" },
  { name: "Drawing", image: "/hobbyist-otis/painting.png" },
  { name: "Poker", image: "/hobbyist-otis/poker.png" },
  { name: "Piano", image: "/hobbyist-otis/piano.png" },
  { name: "Coding", image: "/hobbyist-otis/gaming.png" },
  { name: "Yoga", image: null },
  { name: "Gardening", image: "/hobbyist-otis/garden.png" },
  { name: "Writing", image: "/hobbyist-otis/reading.png" },
  { name: "Dancing", image: "/hobbyist-otis/singing.png" },
] as const;
