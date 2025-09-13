// supabase/functions/chat/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // This is needed for the browser to call the function
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()
    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY')

    if (!deepseekApiKey) {
      throw new Error('DEEPSEEK_API_KEY is not set.')
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // Use the model you prefer
        messages: [
          { role: 'system', content: 'You are IWA, an Intelligent Work Assistant.' },
          { role: 'user', content: prompt }
        ],
        stream: false // We'll keep it simple for now
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API error: ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})