import { Play, BookOpen, Headphones } from "lucide-react";

interface ResourceIconProps {
  type: string;
}

export function ResourceIcon({ type }: ResourceIconProps) {
  switch (type) {
    case "video":
      return <Play className="w-4 h-4" />;
    case "article":
      return <BookOpen className="w-4 h-4" />;
    case "audio":
      return <Headphones className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
}
