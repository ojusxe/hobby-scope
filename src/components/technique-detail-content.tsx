import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { ResourcePreview } from "@/components/resource-preview";
import type { Technique, Resource } from "@/lib/schemas";

interface TechniqueDetailContentProps {
  technique: Technique;
  onComplete: () => void;
  onRemove: () => void;
}

export function TechniqueDetailContent({
  technique,
  onComplete,
  onRemove,
}: TechniqueDetailContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{technique.title}</h3>
        <p className="text-muted-foreground">{technique.description}</p>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Resources
        </h4>
        {technique.resources?.map((resource: Resource, idx: number) => (
          <ResourcePreview key={idx} resource={resource} />
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={onComplete}
          className={`flex-1 ${
            technique.completed
              ? "bg-cr-green hover:bg-cr-green/90"
              : "bg-cr-green hover:bg-cr-green/90"
          }`}
        >
          <Check className="w-4 h-4 mr-2" />
          {technique.completed ? "Completed!" : "Mark Complete"}
        </Button>
        <Button variant="outline" onClick={onRemove} className="text-destructive">
          <X className="w-4 h-4 mr-2" />
          Remove
        </Button>
      </div>
    </div>
  );
}
