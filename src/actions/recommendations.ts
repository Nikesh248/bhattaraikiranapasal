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

interface ActionResult {
    success: boolean;
    output?: RecommendProductsOutput;
    error?: string;
}

export async function getRecommendationsAction(input: RecommendProductsInput): Promise<ActionResult> {
    if (!isAiConfigured) {
        return { success: false, error: "AI service is not configured." };
    }

    try {
        const output = await recommendProducts(input);
        return { success: true, output: output };
    } catch (error) {
        console.error("Server action error fetching recommendations:", error);
        const errorMessage = error instanceof Error ? error.message : "An internal error occurred while fetching recommendations.";
        return { success: false, error: errorMessage };
    }
}
