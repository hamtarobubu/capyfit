import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  const navigate = useNavigate();
  const { user, session } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadUserData();
  }, [user, navigate]);

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
            <CardTitle>{capybaraName}'s Status</CardTitle>
            <CardDescription>Keep your capybara happy by feeding them!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CapybaraDisplay 
              steps={todaySteps}
              goalReached={todaySteps >= goal}
              isFeeding={feeding}
            />
            <div className="text-center">
              <p className="text-2xl font-bold">🍌 {bananas} Bananas Available</p>
              <p className="text-muted-foreground">Earned: {bananasEarned} from today's steps</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Steps</CardTitle>
            <CardDescription>Track your progress towards your daily goal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar steps={todaySteps} goal={goal} />
            
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}