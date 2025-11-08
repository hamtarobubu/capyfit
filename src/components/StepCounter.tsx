import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface StepCounterProps {
  steps: number;
  onStepsChange: (steps: number) => void;
}

export const StepCounter = ({ steps, onStepsChange }: StepCounterProps) => {
  const [inputValue, setInputValue] = useState("");

  const addSteps = (amount: number) => {
    onStepsChange(Math.max(0, steps + amount));
  };

  const handleInputSubmit = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value) && value > 0) {
      addSteps(value);
      setInputValue("");
    }
  };

  return (
    <Card className="p-6 bg-card shadow-[var(--shadow-card)]">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Today's Steps</h3>
          <div className="text-5xl font-bold text-primary">{steps.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground mt-1">of 10,000 goal</p>
        </div>

        <div className="flex gap-2 items-center justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => addSteps(-100)}
            disabled={steps === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Add steps"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
              className="w-32"
            />
            <Button onClick={handleInputSubmit} disabled={!inputValue}>
              Add
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => addSteps(100)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 justify-center">
          <Button variant="secondary" size="sm" onClick={() => addSteps(1000)}>
            +1,000
          </Button>
          <Button variant="secondary" size="sm" onClick={() => addSteps(5000)}>
            +5,000
          </Button>
        </div>
      </div>
    </Card>
  );
};
