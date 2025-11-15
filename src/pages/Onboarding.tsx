import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { getCapybaraData, saveCapybaraData, hasOnboardingData } from '@/utils/localStorageHelper';
import capybaraTreadmill from '@/assets/capybara-treadmill.png';

export default function Onboarding() {
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('other');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');
  const [dailyStepGoal, setDailyStepGoal] = useState('10000');
  const [capybaraName, setCapybaraName] = useState('Hamtaro');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If user already has onboarding data, redirect to dashboard
    if (hasOnboardingData()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const data = getCapybaraData();
      
      data.userProfile = {
        displayName: displayName.trim(),
        gender,
        height: parseInt(height) || 170,
        weight: parseInt(weight) || 70,
      };
      data.dailyStepGoal = parseInt(dailyStepGoal) || 10000;
      data.capybaraName = capybaraName.trim() || 'Hamtaro';
      
      saveCapybaraData(data);
      
      toast.success('Profile created! Welcome to CapyFit! 🎉');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--grass-green))] via-[hsl(var(--water-blue))] to-[hsl(var(--capybara-brown))] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-[hsl(var(--card-gradient-start))] to-[hsl(var(--card-gradient-end))] border-[hsl(var(--card-border))] shadow-[var(--shadow-card)] relative">
        <img 
          src={capybaraTreadmill} 
          alt="Capybara exercising" 
          className="absolute top-4 right-4 w-20 h-20 object-contain z-10 animate-bounce"
        />
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to CapyFit!</CardTitle>
          <CardDescription>Let's set up your profile and meet your capybara</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Your Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup value={gender} onValueChange={setGender}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyStepGoal">Daily Step Goal</Label>
              <Input
                id="dailyStepGoal"
                type="number"
                value={dailyStepGoal}
                onChange={(e) => setDailyStepGoal(e.target.value)}
                min="1000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capybaraName">Your Capybara's Name</Label>
              <Input
                id="capybaraName"
                value={capybaraName}
                onChange={(e) => setCapybaraName(e.target.value)}
                placeholder="Hamtaro"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Profile...' : 'Start Your Journey'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
