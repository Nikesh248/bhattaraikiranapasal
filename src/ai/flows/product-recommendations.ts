'use server';
/**
 * @fileOverview Recommends products based on user's search history.
 *
 * - recommendProducts - A function that handles the product recommendation process.
 * - RecommendProductsInput - The input type for the recommendProducts function.
 * - RecommendProductsOutput - The return type for the recommendProducts function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

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

export async function recommendProducts(input: RecommendProductsInput): Promise<RecommendProductsOutput> {
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
  prompt: `Based on the user's past search history: {{searchHistory}},
  and the items in their current cart (if any): {{currentCart}},
  recommend {{numberOfRecommendations}} relevant products they might be interested in. Return the recommendations as a list of product names, separated by commas.`,
});

const recommendProductsFlow = ai.defineFlow<
  typeof RecommendProductsInputSchema,
  typeof RecommendProductsOutputSchema
>(
  {
    name: 'recommendProductsFlow',
    inputSchema: RecommendProductsInputSchema,
    outputSchema: RecommendProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
