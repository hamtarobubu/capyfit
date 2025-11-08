import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  steps: number;
  goal?: number;
}

export const ProgressBar = ({ steps, goal = 10000 }: ProgressBarProps) => {
  const progress = Math.min((steps / goal) * 100, 100);
  const isComplete = steps >= goal;

  return (
    <div className="w-full space-y-2">
      <Progress 
        value={progress} 
        className={cn(
          "h-4 transition-all duration-500",
          isComplete && "bg-success/20"
        )}
      />
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className={cn(
          "font-semibold",
          isComplete ? "text-success" : "text-foreground"
        )}>
          {progress.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};
