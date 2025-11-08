import { useEffect, useState } from "react";
import capybaraHappy from "@/assets/capybara-happy.png";
import capybaraHungry from "@/assets/capybara-hungry.png";
import capybaraEating from "@/assets/capybara-eating.png";
import { cn } from "@/lib/utils";

interface CapybaraDisplayProps {
  steps: number;
  goalReached: boolean;
  isFeeding: boolean;
}

export const CapybaraDisplay = ({ steps, goalReached, isFeeding }: CapybaraDisplayProps) => {
  const [currentImage, setCurrentImage] = useState(capybaraHungry);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (isFeeding) {
      setCurrentImage(capybaraEating);
      setBounce(true);
      setTimeout(() => setBounce(false), 1000);
    } else if (goalReached) {
      setCurrentImage(capybaraHappy);
    } else if (steps > 5000) {
      setCurrentImage(capybaraHappy);
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
      </div>
    </div>
  );
};
