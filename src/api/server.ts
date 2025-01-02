import 'dotenv/config';
import fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

const server = fastify({
  logger: true,
});

server.register(cors);
server.register(multipart);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp', // Changed model to a stable release
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
});

server.post('/analyze-song', async (request, reply) => {
  try {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ error: 'Audio file is required' });
    }

    const songTitle = data.filename.replace(/\.[^/.]+$/, ''); // Remove file extension

    // First transcribe the audio
    const transcriptionPrompt = `Transcribe the following audio file into lyrics. 
      Return only the raw lyrics text without any additional commentary or formatting.`;

    const transcriptionResult = await model.generateContent(
      transcriptionPrompt
    );
    const transcriptionResponse = await transcriptionResult.response;
    const lyrics = transcriptionResponse.text();

    if (!lyrics || lyrics.trim() === '') {
      return reply.status(400).send({ error: 'Failed to transcribe audio' });
    }

    console.log('Transcribed lyrics:', lyrics);

    const prompt = `Analyze the emotional aspects of the following song lyrics. Provide a detailed analysis in JSON format with these fields:
    {
      "overall_emotion": "A concise description of the dominant emotion",
      "mood": "The general atmosphere or feeling conveyed",
      "feeling": "The emotional impact on the listener",
      "vocal_delivery": "How the vocal performance contributes to the emotion"
    }

    Be specific and avoid generic statements. Use descriptive language and provide concrete examples from the lyrics to support your analysis.

    Song: ${songTitle || 'Untitled'}
    Lyrics:
    ${lyrics}

    Return ONLY the JSON object, no additional text or explanation.`;

    console.log('Generated prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;

    console.log('Raw Gemini response:', response);
    console.log('Response text:', response.text());

    if (!response.text) {
      return reply.status(500).send({
        error: 'No analysis generated',
        message: 'The API did not return any analysis text',
      });
    }

    const responseText = response.text();

    if (!responseText || responseText.trim() === '') {
      return reply.status(500).send({
        error: 'Empty response from API',
        message: 'The API returned an empty response',
      });
    }

    try {
      // Improved JSON extraction:
      let jsonString = responseText;
      const jsonStartIndex = responseText.indexOf('{');
      const jsonEndIndex = responseText.lastIndexOf('}') + 1;

      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        jsonString = responseText.substring(jsonStartIndex, jsonEndIndex);
      } else {
        // Handle cases where JSON is not clearly delimited
        console.warn(
          'JSON delimiters not found, attempting to parse the entire response'
        );
      }

      const analysis = JSON.parse(jsonString);
      return {
        analysis: {
          lyrics,
          emotional_aspects: analysis,
        },
      };
    } catch (error) {
      console.error('Error parsing analysis:', error);
      console.error('Problematic response text:', responseText);
      return reply.status(500).send({
        error: 'Invalid analysis format',
        message: 'The API returned malformed analysis data',
      });
    }
  } catch (error) {
    console.error('Error analyzing song:', error);
    return reply.status(500).send({
      error: 'Failed to analyze song',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

const PORT: number = parseInt(process.env.PORT || '3001');
server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  // Added host: '0.0.0.0'
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`API server running on ${address}`);
});
