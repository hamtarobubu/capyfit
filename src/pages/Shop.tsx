import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function Shop() {
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);
  const [bananas, setBananas] = useState(0);
  const navigate = useNavigate();
  const { user, session } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadBananas();
  }, [user, navigate]);

  const loadBananas = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('bananas')
        .select('banana_count')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setBananas(data.banana_count);
      }
    } catch (error: any) {
      console.error('Error loading bananas:', error);
    }
  };

  const handlePurchase = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('shop-fake-purchase', {
        body: { quantity: parseInt(quantity) },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setBananas(data.totalBananas);
      toast.success(data.message);
      setQuantity('1');
    } catch (error: any) {
      toast.error(error.message || 'Failed to purchase bananas');
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
          <h1 className="text-3xl font-bold text-foreground">Banana Shop</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
            <CardDescription>Your available bananas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-center">🍌 {bananas}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Bananas</CardTitle>
            <CardDescription>Buy extra bananas to keep your capybara happy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:bg-accent" onClick={() => setQuantity('1')}>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl">🍌</p>
                  <p className="font-bold">1 Banana</p>
                  <p className="text-sm text-muted-foreground">$0.99</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-accent" onClick={() => setQuantity('5')}>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl">🍌×5</p>
                  <p className="font-bold">5 Bananas</p>
                  <p className="text-sm text-muted-foreground">$3.99</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-accent" onClick={() => setQuantity('10')}>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl">🍌×10</p>
                  <p className="font-bold">10 Bananas</p>
                  <p className="text-sm text-muted-foreground">$6.99</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Custom Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>

            <Button 
              onClick={handlePurchase} 
              disabled={loading || !quantity || parseInt(quantity) < 1}
              className="w-full"
              size="lg"
            >
              {loading ? 'Processing...' : `Buy ${quantity} Banana(s)`}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              This is a demo purchase. No real payment is required.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}