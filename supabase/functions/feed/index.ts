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

    console.log('Feed capybara for user:', user.id);

    // Get today's steps
    const today = new Date().toISOString().split('T')[0];
    const { data: stepsData, error: stepsError } = await supabase
      .from('daily_steps')
      .select('steps')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (stepsError && stepsError.code !== 'PGRST116') {
      console.error('Error fetching steps:', stepsError);
      throw stepsError;
    }

    const steps = stepsData?.steps || 0;

    // Get user's goal
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('daily_step_goal')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    const goal = profile.daily_step_goal;
    const bananasEarned = Math.floor(steps / goal);

    if (bananasEarned < 1) {
      return new Response(
        JSON.stringify({ error: 'Not enough steps to earn a banana' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    if (currentBananas < 1) {
      return new Response(
        JSON.stringify({ error: 'No bananas available' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Deduct one banana
    const { error: updateError } = await supabase
      .from('bananas')
      .update({ banana_count: currentBananas - 1 })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating bananas:', updateError);
      throw updateError;
    }

    // Log transaction
    await supabase.from('transactions').insert({
      user_id: user.id,
      transaction_type: 'feed',
      amount: -1,
      description: 'Fed capybara',
    });

    console.log('Capybara fed successfully');

    return new Response(
      JSON.stringify({ success: true, remainingBananas: currentBananas - 1 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in feed:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});