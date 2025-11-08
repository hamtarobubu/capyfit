import { useState, useEffect } from "react";

interface CapybaraData {
  steps: number;
  streak: number;
  totalDaysFed: number;
  lastFedDate: string | null;
  dailySteps: { date: string; steps: number }[];
}

const STORAGE_KEY = "capyfit-data";
const INITIAL_DATA: CapybaraData = {
  steps: 0,
  streak: 0,
  totalDaysFed: 0,
  lastFedDate: null,
  dailySteps: [],
};

export const useCapybaraData = () => {
  const [data, setData] = useState<CapybaraData>(INITIAL_DATA);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);
      checkStreak(parsed);
    }
  }, []);

  const checkStreak = (currentData: CapybaraData) => {
    if (!currentData.lastFedDate) return;

    const lastFed = new Date(currentData.lastFedDate);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastFed.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      // Streak broken
      const newData = { ...currentData, streak: 0 };
      setData(newData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    }
  };

  const saveData = (newData: CapybaraData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const updateSteps = (steps: number) => {
    const newData = { ...data, steps };
    saveData(newData);
  };

  const feedCapybara = () => {
    if (data.steps < 10000) return false;

    const today = new Date().toISOString().split("T")[0];
    const alreadyFedToday = data.lastFedDate === today;

    if (alreadyFedToday) return false;

    const newStreak = data.lastFedDate ? data.streak + 1 : 1;
    const newData = {
      ...data,
      steps: 0,
      streak: newStreak,
      totalDaysFed: data.totalDaysFed + 1,
      lastFedDate: today,
      dailySteps: [...data.dailySteps, { date: today, steps: data.steps }],
    };

    saveData(newData);
    return true;
  };

  const resetDaily = () => {
    const today = new Date().toISOString().split("T")[0];
    if (data.lastFedDate !== today) {
      checkStreak(data);
    }
  };

  useEffect(() => {
    resetDaily();
  }, []);

  const averageSteps = data.dailySteps.length > 0
    ? Math.round(data.dailySteps.reduce((sum, day) => sum + day.steps, 0) / data.dailySteps.length)
    : 0;

  return {
    steps: data.steps,
    streak: data.streak,
    totalDaysFed: data.totalDaysFed,
    averageSteps,
    updateSteps,
    feedCapybara,
    canFeed: data.steps >= 10000 && data.lastFedDate !== new Date().toISOString().split("T")[0],
  };
};
