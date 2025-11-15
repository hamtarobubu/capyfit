import { useEffect, useState } from "react";
import capybaraHungry from "@/assets/capybara-hungry.png";
import capybaraSlightlyHappy from "@/assets/capybara-slightly-happy.png";
import capybaraHappy from "@/assets/capybara-happy.png";
import capybaraVeryHappy from "@/assets/capybara-very-happy.png";
import capybaraSuperHappy from "@/assets/capybara-super-happy.png";
import capybaraGoalReached from "@/assets/capybara-goal-reached.png";
import capybaraEating from "@/assets/capybara-eating.png";
import { cn } from "@/lib/utils";

interface CapybaraDisplayProps {
  steps: number;
  goalReached: boolean;
  isFeeding: boolean;
  isStarving?: boolean;
}

export const CapybaraDisplay = ({ steps, goalReached, isFeeding, isStarving = false }: CapybaraDisplayProps) => {
  const [currentImage, setCurrentImage] = useState(capybaraHungry);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (isFeeding) {
      setCurrentImage(capybaraEating);
      setBounce(true);
      setTimeout(() => setBounce(false), 1000);
    } else if (goalReached) {
      setCurrentImage(capybaraGoalReached);
    } else if (steps >= 9000) {
      setCurrentImage(capybaraSuperHappy);
    } else if (steps >= 8000) {
      setCurrentImage(capybaraVeryHappy);
    } else if (steps >= 5000) {
      setCurrentImage(capybaraHappy);
    } else if (steps >= 4000) {
      setCurrentImage(capybaraSlightlyHappy);
    } else {
      setCurrentImage(capybaraHungry);
    }
  }, [steps, goalReached, isFeeding]);

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={cn(
          "transition-all duration-500",
          bounce && "animate-bounce"
        )}
      >
        <img
          src={currentImage}
          alt="Capybara"
          className="w-64 h-64 object-contain drop-shadow-xl"
        />
        {isStarving && (
          <>
            <div className="absolute top-[35%] left-[42%] w-3 h-4 bg-blue-400 rounded-full opacity-80 animate-[drip_2s_ease-in-out_infinite]" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <div className="absolute top-[35%] right-[42%] w-3 h-4 bg-blue-400 rounded-full opacity-80 animate-[drip_2s_ease-in-out_infinite_0.5s]" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </>
        )}
      </div>
    </div>
  );
};
