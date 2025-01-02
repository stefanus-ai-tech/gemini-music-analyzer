import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const { songTitle, lyrics } = await req.json();
    
    if (!lyrics) {
      return new Response(
        JSON.stringify({ error: 'Lyrics are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log('Analyzing song:', songTitle);
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze the following song lyrics and provide:
    1. Overall emotion and mood
    2. Key themes and motifs
    3. Technical aspects (rhythm, structure)
    4. Cultural or social context (if relevant)

    Song: ${songTitle || 'Untitled'}
    Lyrics:
    ${lyrics}

    Please provide a comprehensive but concise analysis.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({ analysis }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in analyze-song function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze song',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});