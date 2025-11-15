import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import capybaraHungry from "@/assets/capybara-hungry.png";
import capybaraSlightlyHappy from "@/assets/capybara-slightly-happy.png";
import capybaraHappy from "@/assets/capybara-happy.png";
import capybaraSuperHappy from "@/assets/capybara-super-happy.png";
import capyfitLogo from "@/assets/capyfit-logo.png";
import { Footprints, Heart, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

const growthStages = [
  { image: capybaraHungry, label: "Baby", emoji: "🍼" },
  { image: capybaraSlightlyHappy, label: "Teenager", emoji: "🎒" },
  { image: capybaraHappy, label: "Adult", emoji: "💼" },
  { image: capybaraSuperHappy, label: "Senior", emoji: "🌟" },
];

const Landing = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % growthStages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-grass-green rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Header */}
          <header className="p-8 space-y-4 animate-fade-in max-w-3xl w-full">
            <img 
              src={capyfitLogo} 
              alt="CapyFit Logo" 
              className="w-48 h-48 md:w-64 md:h-64 mx-auto object-contain drop-shadow-lg rounded-3xl"
            />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Walk 10,000 steps daily.<br />
              Keep your capybara happy! 🎉
            </h2>
          </header>

          {/* Hero Section */}
          <div className="p-8 md:p-12 max-w-3xl w-full animate-scale-in">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Capybara Image Slideshow */}
              <div className="flex-shrink-0 flex flex-col items-center gap-4">
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  {growthStages.map((stage, index) => (
                    <img
                      key={stage.label}
                      src={stage.image}
                      alt={`${stage.label} Capybara`}
                      className={`absolute top-0 left-0 w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ${
                        index === currentStage ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <span>{growthStages[currentStage].emoji}</span>
                  <span>{growthStages[currentStage].label}</span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6 text-center">
                <p className="text-lg text-muted-foreground">
                  Meet your new fitness companion! Every day you hit your step goal, 
                  you earn a banana to feed your adorable capybara. Miss a day? 
                  Your capybara gets hungry. Build your streak and watch your friend thrive!
                </p>
                <p className="text-lg text-foreground font-semibold">
                  🍼 Watch your capybara grow from baby → teenager → adult → senior as you keep feeding them! 🌟
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 w-full max-w-3xl">
            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 shadow-[var(--shadow-card)] animate-fade-in flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Footprints className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">Track Your Steps</h3>
                <p className="text-sm text-muted-foreground">Monitor your daily progress toward the 10,000-step goal</p>
              </div>
            </div>

            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 shadow-[var(--shadow-card)] animate-fade-in flex flex-col items-center text-center gap-3" style={{ animationDelay: "0.1s" }}>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">Feed Your Friend</h3>
                <p className="text-sm text-muted-foreground">Earn bananas and keep your capybara well-fed and happy</p>
              </div>
            </div>

            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 shadow-[var(--shadow-card)] animate-fade-in flex flex-col items-center text-center gap-3" style={{ animationDelay: "0.2s" }}>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">Build Your Streak</h3>
                <p className="text-sm text-muted-foreground">Maintain consistency and watch your streak grow</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4 animate-fade-in">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 h-auto hover-scale shadow-[var(--shadow-card)]"
              onClick={() => navigate("/onboarding")}
            >
              Start Now - Name Your Capybara! 🐾
            </Button>
            <p className="text-sm text-muted-foreground">
              Free to start • No credit card required • Takes 2 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
