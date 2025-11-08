import { useState } from "react";
import { CapybaraDisplay } from "@/components/CapybaraDisplay";
import { StepCounter } from "@/components/StepCounter";
import { ProgressBar } from "@/components/ProgressBar";
import { FeedButton } from "@/components/FeedButton";
import { StatsCard } from "@/components/StatsCard";
import { useCapybaraData } from "@/hooks/useCapybaraData";
import { Button } from "@/components/ui/button";
import { BarChart3, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { steps, streak, totalDaysFed, averageSteps, updateSteps, feedCapybara, canFeed } = useCapybaraData();
  const [isFeeding, setIsFeeding] = useState(false);

  const handleFeed = () => {
    const success = feedCapybara();
    if (success) {
      setIsFeeding(true);
      toast.success("Capybara fed! Great job reaching your goal! 🎉", {
        description: "Your streak continues! See you tomorrow!",
      });
      setTimeout(() => setIsFeeding(false), 2000);
    } else {
      toast.error("Already fed today or goal not reached yet!", {
        description: "Keep walking to reach 10,000 steps!",
      });
    }
  };

  const goalReached = steps >= 10000;

  return (
    <div className="min-h-screen bg-[var(--gradient-nature)] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-grass-green rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-2 drop-shadow-sm">CapyFit</h1>
          <p className="text-lg text-muted-foreground">Keep your capybara happy by walking 10,000 steps daily!</p>
        </header>

        {/* Navigation */}
        <div className="flex gap-2 justify-center mb-6">
          <Button variant="secondary" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/stats")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Stats
          </Button>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Stats Overview */}
          <StatsCard streak={streak} totalDaysFed={totalDaysFed} averageSteps={averageSteps} />

          {/* Capybara Display */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-[var(--shadow-card)]">
            <CapybaraDisplay steps={steps} goalReached={goalReached} isFeeding={isFeeding} />
          </div>

          {/* Progress Bar */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <ProgressBar steps={steps} />
          </div>

          {/* Step Counter */}
          <StepCounter steps={steps} onStepsChange={updateSteps} />

          {/* Feed Button */}
          <div className="flex justify-center pt-4">
            <FeedButton canFeed={canFeed} onFeed={handleFeed} isFeeding={isFeeding} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-muted-foreground">
          <p>Daily goal resets at midnight. Keep your streak going! 🔥</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
