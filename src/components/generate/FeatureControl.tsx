import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FeatureControlProps {
  featureKey: string;
  isLocked: boolean;
  confidence: number; // 1 = Low, 2 = Medium, 3 = High
  onLockToggle: (key: string) => void;
  onConfidenceChange: (key: string, value: number) => void;
}

const confidenceLabels = ["Low", "Medium", "High"];

const FeatureControl = ({
  featureKey,
  isLocked,
  confidence,
  onLockToggle,
  onConfidenceChange,
}: FeatureControlProps) => {
  return (
    <div className="flex items-center gap-2 mt-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${isLocked ? 'text-primary bg-primary/20' : 'text-muted-foreground'}`}
              onClick={() => onLockToggle(featureKey)}
            >
              {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLocked ? "Locked - AI will preserve this exactly" : "Unlocked - AI can vary this feature"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="flex-1 flex items-center gap-2">
        <Slider
          value={[isLocked ? 3 : confidence]}
          min={1}
          max={3}
          step={1}
          disabled={isLocked}
          onValueChange={(v) => onConfidenceChange(featureKey, v[0])}
          className="w-16"
        />
        <span className={`text-xs w-12 ${isLocked ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          {isLocked ? "High" : confidenceLabels[confidence - 1]}
        </span>
      </div>
    </div>
  );
};

export default FeatureControl;
