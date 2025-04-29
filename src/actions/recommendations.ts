
'use server';
/**
 * @fileOverview Server Action for fetching product recommendations.
 */

import {
  recommendProducts,
  type RecommendProductsInput,
  type RecommendProductsOutput
} from '@/ai/flows/product-recommendations';
import { isAiConfigured } from '@/ai/ai-instance';
import { logger } from 'genkit/logging'; // Import Genkit logger

interface ActionResult {
    success: boolean;
    output?: RecommendProductsOutput;
    error?: string;
}

export async function getRecommendationsAction(input: RecommendProductsInput): Promise<ActionResult> {
    logger.info("getRecommendationsAction called with input:", input);
    if (!isAiConfigured) {
        logger.warn("getRecommendationsAction: AI service is not configured.");
        return { success: false, error: "AI service is not configured." };
    }

    try {
        const output = await recommendProducts(input);
        logger.info("getRecommendationsAction: Recommendations received successfully.");
        return { success: true, output: output };
    } catch (error) {
        // Log the detailed error from the flow/action on the server
        logger.error("Server action error fetching recommendations:", error);

        // Provide a more informative error message to the client
        const errorMessage = error instanceof Error ? error.message : "An internal error occurred while fetching recommendations.";
        logger.warn(`getRecommendationsAction: Returning error to client: ${errorMessage}`);
        return { success: false, error: errorMessage };
    }
}
