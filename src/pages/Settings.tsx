import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { getCapybaraData, saveCapybaraData } from '@/utils/localStorageHelper';

export default function Settings() {
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('other');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');
  const [dailyStepGoal, setDailyStepGoal] = useState('10000');
  const [capybaraName, setCapybaraName] = useState('Hamtaro');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    const data = getCapybaraData();
    
    setDisplayName(data.userProfile.displayName);
    setGender(data.userProfile.gender);
    setHeight(data.userProfile.height.toString());
    setWeight(data.userProfile.weight.toString());
    setDailyStepGoal(data.dailyStepGoal.toString());
    setCapybaraName(data.capybaraName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = getCapybaraData();
      
      data.userProfile = {
        displayName: displayName.trim() || 'User',
        gender,
        height: parseInt(height) || 170,
        weight: parseInt(weight) || 70,
      };
      data.dailyStepGoal = parseInt(dailyStepGoal) || 10000;
      data.capybaraName = capybaraName.trim() || 'Hamtaro';
      
      saveCapybaraData(data);
      toast.success('Settings saved successfully!');
    } catch (error: any) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--grass-green))] via-[hsl(var(--water-blue))] to-[hsl(var(--capybara-brown))] p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>

        <Card className="bg-gradient-to-br from-[hsl(var(--card-gradient-start))] to-[hsl(var(--card-gradient-end))] border-[hsl(var(--card-border))] shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
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
                <Label htmlFor="capybaraName">Capybara's Name</Label>
                <Input
                  id="capybaraName"
                  value={capybaraName}
                  onChange={(e) => setCapybaraName(e.target.value)}
                  placeholder="Hamtaro"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
