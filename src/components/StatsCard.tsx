import { Card } from "@/components/ui/card";
import { Trophy, Flame, TrendingUp } from "lucide-react";

interface StatsCardProps {
  streak: number;
  totalDaysFed: number;
  averageSteps: number;
}

export const StatsCard = ({ streak, totalDaysFed, averageSteps }: StatsCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-accent/20">
            <Flame className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-2xl font-bold text-accent">{streak} days</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary/20">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Days Fed</p>
            <p className="text-2xl font-bold text-primary">{totalDaysFed} days</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-secondary/20">
            <TrendingUp className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Steps</p>
            <p className="text-2xl font-bold text-secondary">{averageSteps.toLocaleString()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
