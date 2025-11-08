import { useCapybaraData } from "@/hooks/useCapybaraData";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Stats = () => {
  const navigate = useNavigate();
  const { steps, streak, totalDaysFed, averageSteps } = useCapybaraData();

  return (
    <div className="min-h-screen bg-[var(--gradient-nature)] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-10 w-32 h-32 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-8 w-8 text-accent" />
            <h1 className="text-5xl font-bold text-foreground drop-shadow-sm">Your Stats</h1>
          </div>
          <p className="text-lg text-muted-foreground">Track your fitness journey with your capybara</p>
        </header>

        {/* Navigation */}
        <div className="flex gap-2 justify-center mb-8">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="secondary" size="sm">
            <Trophy className="mr-2 h-4 w-4" />
            Stats
          </Button>
        </div>

        {/* Stats Content */}
        <div className="space-y-6">
          {/* Main Stats Cards */}
          <StatsCard streak={streak} totalDaysFed={totalDaysFed} averageSteps={averageSteps} />

          {/* Current Progress */}
          <Card className="p-8 bg-card/80 backdrop-blur-sm shadow-[var(--shadow-card)]">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Today's Progress</h2>
            <div className="text-center space-y-4">
              <div className="inline-block p-8 rounded-2xl bg-primary/10">
                <div className="text-6xl font-bold text-primary">{steps.toLocaleString()}</div>
                <p className="text-lg text-muted-foreground mt-2">steps today</p>
              </div>
              <div className="pt-4">
                {steps >= 10000 ? (
                  <div className="text-success font-semibold text-lg">
                    ✅ Goal reached! Don't forget to feed your capybara!
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    {(10000 - steps).toLocaleString()} steps to go!
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Achievements Section */}
          <Card className="p-8 bg-card/80 backdrop-blur-sm shadow-[var(--shadow-card)]">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg text-center ${totalDaysFed >= 1 ? 'bg-accent/20' : 'bg-muted/20 opacity-50'}`}>
                <div className="text-3xl mb-2">🌟</div>
                <div className="text-sm font-semibold">First Feed</div>
                <div className="text-xs text-muted-foreground">Feed once</div>
              </div>
              <div className={`p-4 rounded-lg text-center ${streak >= 3 ? 'bg-accent/20' : 'bg-muted/20 opacity-50'}`}>
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-sm font-semibold">3 Day Streak</div>
                <div className="text-xs text-muted-foreground">3 days in a row</div>
              </div>
              <div className={`p-4 rounded-lg text-center ${streak >= 7 ? 'bg-accent/20' : 'bg-muted/20 opacity-50'}`}>
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-sm font-semibold">Week Warrior</div>
                <div className="text-xs text-muted-foreground">7 day streak</div>
              </div>
              <div className={`p-4 rounded-lg text-center ${totalDaysFed >= 30 ? 'bg-accent/20' : 'bg-muted/20 opacity-50'}`}>
                <div className="text-3xl mb-2">👑</div>
                <div className="text-sm font-semibold">Champion</div>
                <div className="text-xs text-muted-foreground">30 days fed</div>
              </div>
            </div>
          </Card>

          {/* Motivational Message */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <p className="text-center text-foreground font-medium">
              {streak > 0 
                ? `🎉 Amazing! You've kept your streak for ${streak} ${streak === 1 ? 'day' : 'days'}! Keep it up!`
                : "Start your journey today! Feed your capybara by reaching 10,000 steps! 🚶‍♂️"
              }
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Stats;
