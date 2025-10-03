// Edge function to keep database active
// This function will be called by a cron job every 3 days

Deno.serve(async (req) => {
  try {
    // Simple database query to keep connection active
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Perform a simple query to keep database active
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Database ping error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          timestamp: new Date().toISOString() 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log('Database ping successful at:', new Date().toISOString());
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Database is active',
        timestamp: new Date().toISOString() 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: String(error),
        timestamp: new Date().toISOString() 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});
