
'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/product-card';
import { mockProducts } from '@/lib/data'; // Keep using mockProducts for finding recommendations for now
import type { Product } from '@/types';
import { useCartStore } from '@/hooks/use-cart';
import { recommendProducts } from '@/ai/flows/product-recommendations';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, AlertCircle } from "lucide-react";
import { isAiConfigured } from '@/ai/ai-instance'; // Import check for AI configuration

// Helper function to find product by name (case-insensitive)
const findProductByName = (name: string): Product | undefined => {
  const lowerCaseName = name.toLowerCase();
  return mockProducts.find(p => p.name.toLowerCase() === lowerCaseName);
};

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true); // Start as true
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const searchHistory = useCartStore((state) => state.searchHistory);
  const cartItems = useCartStore((state) => state.items);
  const [aiAvailable, setAiAvailable] = useState(false); // Track AI availability client-side

  useEffect(() => {
    // Check AI configuration status on the client after mount
    setAiAvailable(isAiConfigured);

    const fetchRecommendations = async () => {
      // Only fetch if AI is configured and there's history/cart
      if (!isAiConfigured) {
          console.log("AI not configured, skipping recommendations fetch.");
          setIsLoadingRecommendations(false);
          setRecommendations([]);
          setRecommendationError("AI recommendations are currently unavailable. Please ensure the API key is configured.");
          return;
      }

      if (searchHistory.length === 0 && cartItems.length === 0) {
        setIsLoadingRecommendations(false);
        setRecommendations([]); // No basis for recommendations
        return;
      }

      setIsLoadingRecommendations(true);
      setRecommendationError(null);
      try {
        const result = await recommendProducts({
          searchHistory: searchHistory,
          currentCart: cartItems.map(item => item.name), // Send current cart item names
          numberOfRecommendations: 3,
        });

        // Map AI recommendations (product names) to actual Product objects
        const recommendedProducts = result.recommendations
          .map(recName => findProductByName(recName)) // Use helper function
          .filter((p): p is Product => p !== undefined); // Filter out undefined results

        setRecommendations(recommendedProducts);

      } catch (error) {
        console.error("Error fetching recommendations:", error);
        const errorMessage = error instanceof Error ? error.message : "Could not load recommendations at this time.";
        setRecommendationError(errorMessage);
        setRecommendations([]);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [searchHistory, cartItems]); // Re-fetch when search history or cart changes


  // Render loading state only if AI is expected to be available
  if (isLoadingRecommendations && aiAvailable) {
    return (
       <section>
           <Alert className="bg-secondary border-primary/50">
             <Lightbulb className="h-4 w-4 text-primary animate-pulse" />
             <AlertTitle className="text-primary">Looking for recommendations...</AlertTitle>
             <AlertDescription>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Skeleton className="h-[350px] w-full rounded-lg" />
                  <Skeleton className="h-[350px] w-full rounded-lg" />
                  <Skeleton className="h-[350px] w-full rounded-lg" />
               </div>
             </AlertDescription>
           </Alert>
       </section>
    );
  }

  // Render error state (includes AI not configured error)
  if (recommendationError) {
    return (
      <section>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Recommendation Error</AlertTitle>
          <AlertDescription>{recommendationError}</AlertDescription>
        </Alert>
      </section>
    );
  }

  // Render recommendations if available and AI is configured
  if (aiAvailable && recommendations.length > 0) {
    return (
      <section>
         <Alert className="bg-secondary border-primary/50">
           <Lightbulb className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Recommended For You</AlertTitle>
          <AlertDescription>
            Based on your activity, you might like these:
             <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {recommendations.map((product) => (
                 <ProductCard key={product.id} product={product} />
               ))}
            </div>
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  // Return null or a placeholder if no recommendations and no error/loading, or if AI is not configured and loading is done
  return null;
}
