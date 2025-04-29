
'use server';
/**
 * @fileOverview Recommends products based on user's search history.
 *
 * - recommendProducts - A function that handles the product recommendation process.
 * - RecommendProductsInput - The input type for the recommendProducts function.
 * - RecommendProductsOutput - The return type for the recommendProducts function.
 */

import { ai, ensureAiIsConfigured, isAiConfigured } from '@/ai/ai-instance';
import { z } from 'genkit';
import { logger } from 'genkit/logging'; // Import Genkit logger
import { cache } from 'react';

const RecommendProductsInputSchema = z.object({
  searchHistory: z.array(z.string()).describe('The user\'s search history.'),
  currentCart: z.array(z.string()).optional().describe('The user\'s current cart.'),
  numberOfRecommendations: z.number().default(3).describe('The number of product recommendations to return.'),
});
export type RecommendProductsInput = z.infer<typeof RecommendProductsInputSchema>;

const RecommendProductsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of product recommendations based on the search history.'),
});
export type RecommendProductsOutput = z.infer<typeof RecommendProductsOutputSchema>;

// This internal function is called by the Server Action
const recommendProductsFlowInternal = cache(
    async (input: RecommendProductsInput): Promise<RecommendProductsOutput> => {
    logger.info("recommendProductsFlowInternal started with input:", input); // Log input
    try {
        // Double-check AI config within the flow execution
        // ensureAiIsConfigured(); // This check is handled in the action layer

        logger.debug("Calling recommendProductsPrompt...");
        const {output, usage} = await prompt(input);
        logger.debug("recommendProductsPrompt response received:", { output, usage }); // Log output and usage

        if (!output) {
            logger.error("AI prompt did not return an output.");
            throw new Error("AI prompt did not return an output.");
        }
        logger.info("recommendProductsFlowInternal completed successfully.");
        return output;
    } catch (error: any) {
        // Log the detailed error on the server
        logger.error('Error in recommendProductsFlowInternal:', error);

        // Re-throw specific errors for the action layer to handle
        if (error instanceof Error) {
            if (/API key not valid/i.test(error.message)) {
                 logger.warn("Invalid API Key detected in flow.");
                 throw new Error("Failed to get recommendations: Invalid API Key. Please check server configuration.");
            }
            if (/AI features are not configured/i.test(error.message)) {
               logger.warn("AI features not configured error caught in flow.");
               throw new Error("Failed to get recommendations: AI service is not configured.");
            }
             // Check for model overload / 503 error
            if (/503 Service Unavailable/i.test(error.message) || /model is overloaded/i.test(error.message)) {
                logger.warn("Model overload error detected in flow.");
                throw new Error("Failed to get recommendations: The recommendation service is temporarily busy. Please try again later.");
            }
            // Include original error message for other internal errors
            logger.error("Generic internal error in flow:", error.message);
            throw new Error(`Failed to get recommendations due to an internal error: ${error.message}`);
        }
        // Throw a more generic error for non-Error objects
        logger.error("Unknown error type in flow:", error);
        throw new Error("Failed to get recommendations due to an unknown internal error.");
    }
}
);


// Exported function to be used by Server Actions. It wraps the flow definition.
// Error handling and AI availability checks are better handled in the calling Server Action.
export async function recommendProducts(input: RecommendProductsInput): Promise<RecommendProductsOutput> {
  // We ensure AI is configured in the action that calls this.
  // If called directly elsewhere, the caller should check isAiConfigured.
  logger.info("recommendProducts action handler called.");
  if (!isAiConfigured) {
      logger.warn("Attempted to call recommendProducts but AI is not configured.");
      throw new Error("AI service is not configured."); // Throw error if called when AI is not configured
  }
  return recommendProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendProductsPrompt',
  input: {
    schema: z.object({
      searchHistory: z
        .array(z.string())
        .describe('The user\'s search history, as a list of search queries.'),
      currentCart: z.array(z.string()).optional().describe('The user\'s current cart.'),
      numberOfRecommendations: z.number().describe('The number of product recommendations to return.'),
    }),
  },
  output: {
    schema: z.object({
      recommendations: z
        .array(z.string())
        .describe('A list of product recommendations based on the search history.'),
    }),
  },
  // Adjusted prompt for clarity and to potentially handle empty history/cart better
  prompt: `You are a helpful shopping assistant for Bhattarai Kirana Pasal.
Based on the user's recent search history:
{{#if searchHistory}}
{{#each searchHistory}}
- {{{this}}}
{{/each}}
{{else}}
(No search history provided)
{{/if}}

And the items currently in their cart:
{{#if currentCart}}
{{#each currentCart}}
- {{{this}}}
{{/each}}
{{else}}
(Cart is empty)
{{/if}}

Recommend {{numberOfRecommendations}} relevant products available at the store that they might be interested in.
Focus on suggesting items that complement their searches or cart items. If history and cart are empty, suggest popular items.
Return ONLY a list of product names.`,
});

// Define the flow using the internal function for cleaner error propagation
const recommendProductsFlow = ai.defineFlow<
  typeof RecommendProductsInputSchema,
  typeof RecommendProductsOutputSchema
>(
  {
    name: 'recommendProductsFlow',
    inputSchema: RecommendProductsInputSchema,
    outputSchema: RecommendProductsOutputSchema,
  },
  recommendProductsFlowInternal // Use the internal async function
);
