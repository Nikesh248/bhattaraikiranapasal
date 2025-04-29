
import { genkit, GenkitPlugin } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Define the plugins array
const plugins: GenkitPlugin[] = [];

// Check if the Google Generative AI API key is provided in environment variables
if (process.env.GOOGLE_GENAI_API_KEY) {
  plugins.push(
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    })
  );
} else {
  console.warn(
    '\n********************************************************************\n' +
    'WARNING: GOOGLE_GENAI_API_KEY environment variable not found.\n' +
    'AI features requiring the Google AI plugin will not function.\n' +
    'Please create a .env file in the root directory and add:\n' +
    'GOOGLE_GENAI_API_KEY=YOUR_API_KEY_HERE\n' +
    'Get your API key from Google AI Studio: https://aistudio.google.com/app/apikey\n' +
    '********************************************************************\n'
  );
  // Optionally, you could add a placeholder/mock plugin here for development
  // Or allow the app to run without AI capabilities.
}


export const ai = genkit({
  promptDir: './prompts',
  plugins: plugins,
  // Specify a model. If the Google AI plugin is not loaded,
  // Genkit might throw an error if no default model is available.
  // Consider adding a check or default behavior if no plugins are loaded.
  // For now, we keep the model definition, but flows will fail if the plugin is missing.
  model: 'googleai/gemini-2.0-flash',
  logLevel: 'debug', // Keep logs for debugging
  enableTracingAndMetrics: true, // Enable tracing
});
