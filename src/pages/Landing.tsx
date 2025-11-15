import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import capybaraHappy from "@/assets/capybara-super-happy.png";
import { Footprints, Heart, TrendingUp } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--gradient-nature)] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-grass-green rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Header */}
          <header className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-[var(--shadow-card)] space-y-4 animate-fade-in max-w-3xl w-full">
            <h1 className="text-6xl md:text-7xl font-bold text-foreground drop-shadow-lg">
              CapyFit
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Transform your daily walks into a heartwarming journey
            </p>
          </header>

          {/* Hero Section */}
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-[var(--shadow-card)] max-w-3xl w-full animate-scale-in">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Capybara Image */}
              <div className="flex-shrink-0">
                <img
                  src={capybaraHappy}
                  alt="Happy Capybara"
                  className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
                />
              </div>

              {/* Content */}
              <div className="space-y-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Walk 10,000 steps daily.<br />
                  Keep your capybara happy! 🎉
                </h2>
                <p className="text-lg text-muted-foreground">
                  Meet your new fitness companion! Every day you hit your step goal, 
                  you earn a banana to feed your adorable capybara. Miss a day? 
                  Your capybara gets hungry. Build your streak and watch your friend thrive!
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Footprints className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Track Your Steps</h3>
              <p className="text-muted-foreground">Monitor your daily progress toward the 10,000-step goal</p>
            </div>

            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Feed Your Friend</h3>
              <p className="text-muted-foreground">Earn bananas and keep your capybara well-fed and happy</p>
            </div>

            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Build Your Streak</h3>
              <p className="text-muted-foreground">Maintain consistency and watch your streak grow</p>
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
