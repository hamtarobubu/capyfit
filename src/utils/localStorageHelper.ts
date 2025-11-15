export interface LocalCapybaraData {
  capybaraName: string;
  dailyStepGoal: number;
  currentDate: string;
  todaySteps: number;
  stepsSubmittedToday: boolean;
  bananas: number;
  bananasEarned: number;
  fedToday: boolean;
  historicalData: { date: string; steps: number }[];
  userProfile: {
    displayName: string;
    gender: string;
    height: number;
    weight: number;
  };
}

const STORAGE_KEY = 'capyfit_data';

const getDefaultData = (): LocalCapybaraData => ({
  capybaraName: 'Hamtaro',
  dailyStepGoal: 10000,
  currentDate: new Date().toISOString().split('T')[0],
  todaySteps: 0,
  stepsSubmittedToday: false,
  bananas: 0,
  bananasEarned: 0,
  fedToday: false,
  historicalData: [],
  userProfile: {
    displayName: '',
    gender: 'other',
    height: 170,
    weight: 70,
  },
});

export const getCapybaraData = (): LocalCapybaraData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const defaultData = getDefaultData();
      saveCapybaraData(defaultData);
      return defaultData;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return getDefaultData();
  }
};

export const saveCapybaraData = (data: LocalCapybaraData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const checkAndResetDaily = (): LocalCapybaraData => {
  const data = getCapybaraData();
  const today = new Date().toISOString().split('T')[0];

  if (data.currentDate !== today) {
    // Archive yesterday's data if there were steps
    if (data.todaySteps > 0) {
      data.historicalData.push({
        date: data.currentDate,
        steps: data.todaySteps,
      });
    }

    // Reset daily data
    data.currentDate = today;
    data.todaySteps = 0;
    data.stepsSubmittedToday = false;
    data.fedToday = false;
    data.bananasEarned = 0;

    saveCapybaraData(data);
  }

  return data;
};

export const hasOnboardingData = (): boolean => {
  const data = getCapybaraData();
  return data.userProfile.displayName !== '';
};

export const resetAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting data:', error);
  }
};
