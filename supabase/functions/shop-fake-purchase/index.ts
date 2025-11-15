import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('Auth error:', userError);
      throw new Error('Unauthorized');
    }

    const { quantity } = await req.json();

    if (typeof quantity !== 'number' || quantity < 1) {
      throw new Error('Invalid quantity');
    }

    console.log('Fake purchase:', { user_id: user.id, quantity });

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get current banana count
    const { data: bananaData, error: bananaError } = await supabase
      .from('bananas')
      .select('banana_count')
      .eq('user_id', user.id)
      .single();

    if (bananaError) {
      console.error('Error fetching bananas:', bananaError);
      throw bananaError;
    }

    const currentBananas = bananaData?.banana_count || 0;

    // Add purchased bananas
    const { error: updateError } = await supabase
      .from('bananas')
      .update({ banana_count: currentBananas + quantity })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating bananas:', updateError);
      throw updateError;
    }

    // Log transaction
    await supabase.from('transactions').insert({
      user_id: user.id,
      transaction_type: 'purchase',
      amount: quantity,
      description: `Purchased ${quantity} banana(s)`,
    });

    console.log('Purchase successful:', { newTotal: currentBananas + quantity });

    return new Response(
      JSON.stringify({ 
        success: true, 
        totalBananas: currentBananas + quantity,
        message: `Successfully purchased ${quantity} banana(s)!`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in shop-fake-purchase:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});