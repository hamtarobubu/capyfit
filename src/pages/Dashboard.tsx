import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CapybaraDisplay } from '@/components/CapybaraDisplay';
import { ProgressBar } from '@/components/ProgressBar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';
import { getCapybaraData, saveCapybaraData, checkAndResetDaily } from '@/utils/localStorageHelper';

export default function Dashboard() {
  const [steps, setSteps] = useState('0');
  const [todaySteps, setTodaySteps] = useState(0);
  const [goal, setGoal] = useState(10000);
  const [bananas, setBananas] = useState(0);
  const [bananasEarned, setBananasEarned] = useState(0);
  const [capybaraName, setCapybaraName] = useState('Hamtaro');
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [historicalData, setHistoricalData] = useState<{ date: string; steps: number }[]>([]);
  const [fedToday, setFedToday] = useState(false);
  const [stepsSubmittedToday, setStepsSubmittedToday] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadLocalData();

    // Check for day changes every minute
    const interval = setInterval(() => {
      const today = new Date().toISOString().split('T')[0];
      if (currentDate !== today) {
        handleDayReset();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentDate]);

  const handleDayReset = () => {
    const data = checkAndResetDaily();
    setCurrentDate(data.currentDate);
    setTodaySteps(data.todaySteps);
    setSteps(data.todaySteps.toString());
    setStepsSubmittedToday(data.stepsSubmittedToday);
    setFedToday(data.fedToday);
    setBananasEarned(data.bananasEarned);
    setHistoricalData(data.historicalData);
    toast.info('New day! Your step counter has been reset.');
  };

  const loadLocalData = () => {
    const data = checkAndResetDaily();
    
    setCapybaraName(data.capybaraName);
    setGoal(data.dailyStepGoal);
    setTodaySteps(data.todaySteps);
    setSteps(data.todaySteps.toString());
    setBananas(data.bananas);
    setBananasEarned(data.bananasEarned);
    setFedToday(data.fedToday);
    setStepsSubmittedToday(data.stepsSubmittedToday);
    setHistoricalData(data.historicalData);
    setCurrentDate(data.currentDate);
  };

  const handleUpdateSteps = () => {
    if (!steps || parseInt(steps) < 0) {
      toast.error('Please enter a valid number of steps');
      return;
    }

    setLoading(true);
    try {
      const data = getCapybaraData();
      const stepCount = parseInt(steps);
      
      data.todaySteps = stepCount;
      data.stepsSubmittedToday = true;
      
      // Calculate earned bananas
      const earned = Math.floor(stepCount / goal);
      const newEarned = earned - bananasEarned;
      
      if (newEarned > 0) {
        data.bananas += newEarned;
        data.bananasEarned = earned;
        setBananas(data.bananas);
        setBananasEarned(data.bananasEarned);
        toast.success(`You earned ${newEarned} banana${newEarned > 1 ? 's' : ''}! 🍌`);
      }
      
      saveCapybaraData(data);
      setTodaySteps(stepCount);
      setStepsSubmittedToday(true);
      toast.success('Steps updated successfully!');
    } catch (error: any) {
      toast.error('Failed to update steps');
    } finally {
      setLoading(false);
    }
  };

  const handleFeed = () => {
    if (bananas < 1) {
      toast.error('You need at least 1 banana to feed your capybara!');
      return;
    }

    setLoading(true);
    try {
      const data = getCapybaraData();
      data.bananas -= 1;
      data.fedToday = true;
      saveCapybaraData(data);
      
      setBananas(data.bananas);
      setFedToday(true);
      toast.success(`${capybaraName} enjoyed the banana! 🍌`);
    } catch (error: any) {
      toast.error('Failed to feed capybara');
    } finally {
      setLoading(false);
    }
  };

  const isToday = selectedDate === currentDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--grass-green))] via-[hsl(var(--water-blue))] to-[hsl(var(--capybara-brown))] p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">CapyFit</h1>
          <Button variant="outline" size="icon" onClick={() => navigate('/settings')}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-[hsl(var(--card-gradient-start))] to-[hsl(var(--card-gradient-end))] border-[hsl(var(--card-border))] shadow-[var(--shadow-card)]">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{capybaraName}</h2>
              <CapybaraDisplay steps={todaySteps} goalReached={todaySteps >= goal} isFeeding={fedToday} />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{todaySteps}</p>
                  <p className="text-sm text-muted-foreground">Today's Steps</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{goal}</p>
                  <p className="text-sm text-muted-foreground">Daily Goal</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">🍌 {bananas}</p>
                  <p className="text-sm text-muted-foreground">Bananas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[hsl(var(--card-gradient-start))] to-[hsl(var(--card-gradient-end))] border-[hsl(var(--card-border))] shadow-[var(--shadow-card)]">
          <CardContent className="pt-6">
            <Tabs value={selectedDate} onValueChange={setSelectedDate}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={currentDate}>Today</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value={currentDate} className="space-y-6 mt-6">
                <ProgressBar steps={todaySteps} goal={goal} />

                {isToday && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="steps">
                        {stepsSubmittedToday ? "Today's Steps (Locked)" : "Update Today's Steps"}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="steps"
                          type="number"
                          value={steps}
                          onChange={(e) => setSteps(e.target.value)}
                          min="0"
                          disabled={stepsSubmittedToday}
                        />
                        <Button onClick={handleUpdateSteps} disabled={loading || stepsSubmittedToday}>
                          {loading ? 'Updating...' : stepsSubmittedToday ? 'Submitted' : 'Update'}
                        </Button>
                      </div>
                      {stepsSubmittedToday && (
                        <p className="text-sm text-muted-foreground">
                          Steps can be updated again tomorrow
                        </p>
                      )}
                    </div>

                    <Button 
                      onClick={handleFeed}
                      disabled={bananas < 1 || loading || fedToday}
                      className="w-full"
                      size="lg"
                    >
                      {fedToday 
                        ? `${capybaraName} is full! Come back tomorrow` 
                        : bananas < 1 
                          ? 'Need bananas to feed!' 
                          : `Feed ${capybaraName} (1 🍌)`}
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4 mt-6">
                {historicalData.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No historical data yet. Start tracking your steps!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {historicalData
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((day) => (
                        <Card 
                          key={day.date}
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => setSelectedDate(day.date)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold">
                                  {new Date(day.date).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {day.steps.toLocaleString()} steps
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl">
                                  {day.steps >= goal ? '🎉' : '📊'}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
