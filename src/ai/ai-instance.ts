
import { genkit, GenkitPlugin, GenkitConfig } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Define the plugins array
const plugins: GenkitPlugin[] = [];
let modelIsAvailable = false;

// Base Genkit configuration
const genkitConfig: GenkitConfig = {
  promptDir: './prompts',
  plugins: plugins,
  logLevel: 'debug', // Keep logs for debugging
  enableTracingAndMetrics: true, // Enable tracing
};

// Check if the Google Generative AI API key is provided in environment variables
if (process.env.GOOGLE_GENAI_API_KEY) {
  try {
    plugins.push(
      googleAI({
        apiKey: process.env.GOOGLE_GENAI_API_KEY,
      })
    );
    // If the plugin is added successfully, specify the model
    genkitConfig.model = 'googleai/gemini-2.0-flash';
    modelIsAvailable = true;
    console.log("Google AI plugin loaded successfully.");
  } catch (error) {
      console.error("\n********************************************************************");
      console.error("ERROR: Failed to initialize Google AI plugin.");
      // Check if the error message indicates an invalid API key specifically
      if (error instanceof Error && /API key not valid/i.test(error.message)) {
         console.error("REASON: The provided GOOGLE_GENAI_API_KEY is invalid.");
      } else {
         console.error("REASON: Could not initialize the plugin. Please check your API key and configuration.");
      }
      console.error("Error details:", error);
      console.error("AI features requiring the Google AI plugin will not function.");
      console.error("Get your API key from Google AI Studio: https://aistudio.google.com/app/apikey");
      console.error("Ensure the key is correctly set in your .env.local file:");
      console.error("GOOGLE_GENAI_API_KEY=YOUR_VALID_API_KEY_HERE");
      console.error("********************************************************************\n");
      modelIsAvailable = false; // Ensure model is marked as unavailable
  }
} else {
  console.warn(
    '\n********************************************************************\n' +
    'WARNING: GOOGLE_GENAI_API_KEY environment variable not found.\n' +
    'AI features requiring the Google AI plugin will not function.\n' +
    'Please create a .env.local file in the root directory and add:\n' +
    'GOOGLE_GENAI_API_KEY=YOUR_API_KEY_HERE\n' +
    'Get your API key from Google AI Studio: https://aistudio.google.com/app/apikey\n' +
    '********************************************************************\n'
  );
  modelIsAvailable = false;
}

// Initialize Genkit with the conditional configuration
export const ai = genkit(genkitConfig);

// Export a flag indicating if the primary AI model is available
export const isAiConfigured = modelIsAvailable;

// Optional: Add a check function to be used within flows
export function ensureAiIsConfigured() {
    if (!isAiConfigured) {
        throw new Error("AI features are not configured. Please check the GOOGLE_GENAI_API_KEY environment variable and server logs.");
    }
}
