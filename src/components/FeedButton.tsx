import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface FeedButtonProps {
  canFeed: boolean;
  onFeed: () => void;
  isFeeding: boolean;
}

export const FeedButton = ({ canFeed, onFeed, isFeeding }: FeedButtonProps) => {
  return (
    <Button
      size="lg"
      onClick={onFeed}
      disabled={!canFeed || isFeeding}
      className="w-full max-w-xs mx-auto text-lg font-bold shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-300"
    >
      <Heart className="mr-2 h-5 w-5" />
      {isFeeding ? "Feeding..." : canFeed ? "Feed Capybara" : "Reach 10,000 steps to feed!"}
    </Button>
  );
};
