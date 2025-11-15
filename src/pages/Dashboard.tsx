import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CapybaraDisplay } from '@/components/CapybaraDisplay';
import { ProgressBar } from '@/components/ProgressBar';
import { toast } from 'sonner';
import { LogOut, Settings, ShoppingBag } from 'lucide-react';

export default function Dashboard() {
  const [steps, setSteps] = useState('0');
  const [todaySteps, setTodaySteps] = useState(0);
  const [goal, setGoal] = useState(10000);
  const [bananas, setBananas] = useState(0);
  const [capybaraName, setCapybaraName] = useState('Happy');
  const [loading, setLoading] = useState(false);
  const [feeding, setFeeding] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [historicalData, setHistoricalData] = useState<{ date: string; steps: number }[]>([]);
  const [fedToday, setFedToday] = useState(false);
  const navigate = useNavigate();
  const { user, session } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadUserData();

    // Check for day change every minute
    const interval = setInterval(() => {
      const newDate = new Date().toISOString().split('T')[0];
      if (newDate !== currentDate) {
        setCurrentDate(newDate);
        setTodaySteps(0);
        setSteps('0');
        loadUserData();
        toast.info('New day! Your step counter has been reset.');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user, navigate, currentDate]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('daily_step_goal, capybara_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        setGoal(profile.daily_step_goal);
        setCapybaraName(profile.capybara_name);
      }

      // Load today's steps
      const today = new Date().toISOString().split('T')[0];
      const { data: stepsData } = await supabase
        .from('daily_steps')
        .select('steps')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (stepsData) {
        setTodaySteps(stepsData.steps);
        setSteps(stepsData.steps.toString());
      }

      // Load bananas
      const { data: bananaData } = await supabase
        .from('bananas')
        .select('banana_count')
        .eq('user_id', user.id)
        .single();

      if (bananaData) {
        setBananas(bananaData.banana_count);
      }

      // Load last 7 days of step data
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const startDate = sevenDaysAgo.toISOString().split('T')[0];

      const { data: histData } = await supabase
        .from('daily_steps')
        .select('date, steps')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .order('date', { ascending: false });

      if (histData) {
        setHistoricalData(histData);
      }

      // Check if fed today
      const { data: feedData } = await supabase
        .from('transactions')
        .select('created_at')
        .eq('user_id', user.id)
        .eq('transaction_type', 'feed')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
        .maybeSingle();

      setFedToday(!!feedData);
    } catch (error: any) {
      console.error('Error loading user data:', error);
    }
  };

  const handleUpdateSteps = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('steps-upsert', {
        body: { steps: parseInt(steps) },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setTodaySteps(parseInt(steps));
      
      // Calculate earned bananas
      const earned = Math.floor(parseInt(steps) / goal);
      if (earned > Math.floor(todaySteps / goal)) {
        setBananas(prev => prev + (earned - Math.floor(todaySteps / goal)));
        toast.success(`You earned ${earned - Math.floor(todaySteps / goal)} banana(s)!`);
      }
      
      toast.success('Steps updated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update steps');
    } finally {
      setLoading(false);
    }
  };

  const handleFeed = async () => {
    if (!session) return;

    setFeeding(true);
    try {
      const { data, error } = await supabase.functions.invoke('feed', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setBananas(data.remainingBananas);
      setFedToday(true);
      toast.success(`${capybaraName} enjoyed the banana!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to feed capybara');
    } finally {
      setFeeding(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const bananasEarned = Math.floor(todaySteps / goal);
  const canFeed = bananas >= 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--grass-green))] via-[hsl(var(--water-blue))] to-[hsl(var(--capybara-brown))] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">CapyFit Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate('/shop')}>
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How is {capybaraName} feeling today?</CardTitle>
            <CardDescription>
              Keep your capybara happy by feeding them! • {new Date(currentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CapybaraDisplay 
              steps={todaySteps}
              goalReached={todaySteps >= goal}
              isFeeding={feeding}
            />
            <div className="text-center">
              <p className="text-xl font-bold">
                🍌 {bananas} Bananas Available • {todaySteps >= goal ? `${capybaraName} is happy!` : `${capybaraName} is starving!`}
              </p>
              <p className="text-muted-foreground">Earned: {bananasEarned} from today's steps</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step Tracking</CardTitle>
            <CardDescription>View your progress by day</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedDate} onValueChange={setSelectedDate}>
              <TabsList className="grid w-full grid-cols-7">
                {(() => {
                  const tabs = [];
                  for (let i = 6; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const isToday = dateStr === currentDate;
                    
                    tabs.push(
                      <TabsTrigger key={dateStr} value={dateStr} className="text-xs">
                        {isToday ? 'Today' : dayName}
                      </TabsTrigger>
                    );
                  }
                  return tabs;
                })()}
              </TabsList>
              
              {(() => {
                const tabContents = [];
                for (let i = 6; i >= 0; i--) {
                  const date = new Date();
                  date.setDate(date.getDate() - i);
                  const dateStr = date.toISOString().split('T')[0];
                  const isToday = dateStr === currentDate;
                  const histEntry = historicalData.find(d => d.date === dateStr);
                  const daySteps = histEntry?.steps || 0;
                  
                  tabContents.push(
                    <TabsContent key={dateStr} value={dateStr} className="space-y-4 mt-4">
                      <div className="text-center mb-4">
                        <p className="text-lg font-semibold">
                          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      
                      <ProgressBar steps={daySteps} goal={goal} />
                      
                      {isToday && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="steps">Update Today's Steps</Label>
                            <div className="flex gap-2">
                              <Input
                                id="steps"
                                type="number"
                                value={steps}
                                onChange={(e) => setSteps(e.target.value)}
                                min="0"
                              />
                              <Button onClick={handleUpdateSteps} disabled={loading}>
                                {loading ? 'Updating...' : 'Update'}
                              </Button>
                            </div>
                          </div>

                          <Button 
                            onClick={handleFeed} 
                            disabled={!canFeed || feeding}
                            className="w-full"
                            size="lg"
                          >
                            {feeding ? 'Feeding...' : canFeed ? `Feed ${capybaraName}` : 'No bananas available'}
                          </Button>
                        </>
                      )}
                      
                      {!isToday && (
                        <div className="text-center text-muted-foreground">
                          <p>Final step count: {daySteps.toLocaleString()} steps</p>
                          <p className="text-sm mt-1">
                            {daySteps >= goal ? '✅ Goal achieved!' : `${(goal - daySteps).toLocaleString()} steps short of goal`}
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  );
                }
                return tabContents;
              })()}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}