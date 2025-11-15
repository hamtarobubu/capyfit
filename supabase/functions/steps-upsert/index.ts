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

    const { steps, date } = await req.json();
    
    if (typeof steps !== 'number' || steps < 0) {
      throw new Error('Invalid steps value');
    }

    const stepDate = date || new Date().toISOString().split('T')[0];

    console.log('Upserting steps:', { user_id: user.id, date: stepDate, steps });

    const { data, error } = await supabase
      .from('daily_steps')
      .upsert({
        user_id: user.id,
        date: stepDate,
        steps,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,date',
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting steps:', error);
      throw error;
    }

    console.log('Steps upserted successfully:', data);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in steps-upsert:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});