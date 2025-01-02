import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "@google/generative-ai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { songTitle, artist, lyrics } = await req.json()

    // Input validation
    if (!lyrics) {
      return new Response(
        JSON.stringify({ error: 'Lyrics are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create prompt for Gemini
    const prompt = `Analyze the following song lyrics for:
    1. Overall sentiment (positive, negative, or neutral)
    2. Key themes and motifs
    3. Literary devices used
    4. Emotional impact
    5. Cultural or social context (if relevant)

    Song: ${songTitle || 'Untitled'}
    Artist: ${artist || 'Unknown'}
    Lyrics:
    ${lyrics}

    Please provide a comprehensive analysis.`

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    // Generate analysis
    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysis = response.text()

    // Create a simple sentiment score (-1 to 1) based on the analysis
    const sentimentScore = analysis.toLowerCase().includes('positive') ? 1 :
                          analysis.toLowerCase().includes('negative') ? -1 : 0

    // Extract key themes (simple implementation)
    const keyThemes = analysis
      .split(/[.,\n]/)
      .filter(sentence => sentence.toLowerCase().includes('theme'))
      .map(theme => theme.trim())
      .filter(theme => theme.length > 0)

    // Store the analysis in the database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const { error: dbError } = await supabaseClient
      .from('song_analysis')
      .insert({
        user_id: req.headers.get('authorization')?.split('Bearer ')[1],
        song_title: songTitle,
        artist,
        lyrics,
        sentiment_score: sentimentScore,
        key_themes: keyThemes,
        analysis_text: analysis
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save analysis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({
        analysis,
        sentiment_score: sentimentScore,
        key_themes: keyThemes
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in analyze-song function:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to analyze song' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})