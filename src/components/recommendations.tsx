
'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/product-card';
// Remove the incorrect import: import { mockProducts } from '@/lib/data';
import { getAllProducts } from '@/lib/data'; // Import the function to fetch all products
import type { Product } from '@/types';
import { useCartStore } from '@/hooks/use-cart';
// Import the server action instead of the flow directly
import { getRecommendationsAction } from '@/actions/recommendations';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, AlertCircle } from "lucide-react";


export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true); // Start as true
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const searchHistory = useCartStore((state) => state.searchHistory);
  const cartItems = useCartStore((state) => state.items);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null); // Track AI availability client-side, null initially

  useEffect(() => {
    const fetchRecommendationsAndProducts = async () => {
      setIsLoadingRecommendations(true);
      setRecommendationError(null);
      setAiAvailable(null); // Reset AI availability status on each fetch

      // Fetch all products first to map recommendations
      let allProducts: Product[] = [];
      try {
        allProducts = await getAllProducts(); // Use the exported function
      } catch (error) {
        console.error("Failed to fetch all products for recommendations:", error);
        setRecommendationError("Could not load product data for recommendations.");
        setIsLoadingRecommendations(false);
        return; // Stop if we can't get products
      }

      // Helper function using the fetched products
      const findProductByNameLocal = (name: string): Product | undefined => {
        if (!name) return undefined; // Handle cases where name might be empty/null
        const lowerCaseName = name.toLowerCase();
        return allProducts.find(p => p.name.toLowerCase() === lowerCaseName);
      };


      // Prevent fetching if AI not configured or history/cart empty
      if (searchHistory.length === 0 && cartItems.length === 0) {
        setIsLoadingRecommendations(false);
        setRecommendations([]); // No basis for recommendations
        setAiAvailable(true); // Assume AI is available but no data to process
        console.log("Skipping recommendations: No search history or cart items.");
        return;
      }

      try {
        // Call the server action
        const result = await getRecommendationsAction({
          searchHistory: searchHistory,
          currentCart: cartItems.map(item => item.name), // Send current cart item names
          numberOfRecommendations: 3,
        });

        // Check for errors returned by the server action
        if (!result.success || !result.output) {
            const errorMsg = result.error || "Failed to get recommendations.";
             // Distinguish between "not configured" and "invalid key" based on the error message from the flow
             if (errorMsg.includes("AI service is not configured") || errorMsg.includes("Invalid API Key")) {
                 setAiAvailable(false);
             } else {
                 setAiAvailable(true); // Assume available but another error occurred
             }
             // Set the error state instead of throwing
             setRecommendationError(errorMsg); // Use the detailed error message from the action
             setRecommendations([]);
             console.error("Server action returned error:", errorMsg); // Log the detailed error message
             // Don't throw here, let the component render the error state
        } else {
            // Success case
            setAiAvailable(true); // AI is configured and worked
            // Map AI recommendations (product names) to actual Product objects
            const recommendedProducts = result.output.recommendations
              .map(recName => findProductByNameLocal(recName)) // Use the local helper
              .filter((p): p is Product => p !== undefined); // Filter out undefined results

            setRecommendations(recommendedProducts);
        }

      } catch (error) {
        // Catch unexpected errors during the action call itself (e.g., network issues)
        console.error("Unexpected error fetching recommendations:", error);
        const errorMessage = error instanceof Error ? error.message : "Could not load recommendations due to an unexpected issue.";
        setRecommendationError(errorMessage);
        setRecommendations([]);
        // We don't know the AI state for sure here, might leave it as null or guess true
        // setAiAvailable(null); // Or true, depending on desired UI
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendationsAndProducts();
  }, [searchHistory, cartItems]); // Re-fetch when search history or cart changes


  // Render loading state only if AI availability hasn't been determined yet or is expected to be available
  if (isLoadingRecommendations && aiAvailable === null) {
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

  // Render error state or AI not configured/invalid key message
   if (aiAvailable === false) {
     // Use the detailed error message stored in recommendationError
     const isInvalidKeyError = recommendationError?.includes("Invalid API Key");
     const isNotConfiguredError = recommendationError?.includes("AI service is not configured");

     let errorTitle = "Recommendation Error";
     let errorDescription = recommendationError || "AI recommendations are currently unavailable."; // Fallback message

     if (isInvalidKeyError) {
        errorTitle = "Invalid AI API Key";
        // Description remains the detailed error message from state
     } else if (isNotConfiguredError) {
         errorTitle = "AI Service Not Configured";
         // Description remains the detailed error message from state
     }

     return (
       <section>
         <Alert variant="destructive">
           <AlertCircle className="h-4 w-4" />
           <AlertTitle>{errorTitle}</AlertTitle>
           <AlertDescription>
              {errorDescription}
              <p className="mt-2 text-xs">If you are the site administrator, check the server logs and ensure the GOOGLE_GENAI_API_KEY environment variable is set correctly.</p>
              <p className="mt-1 text-xs">You can obtain an API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>.</p>
            </AlertDescription>
         </Alert>
       </section>
     );
   }


   // Generic error if AI is available but something else went wrong
   if (recommendationError && aiAvailable === true) {
       return (
         <section>
           <Alert variant="destructive">
             <AlertCircle className="h-4 w-4" />
             <AlertTitle>Recommendation Error</AlertTitle>
             <AlertDescription>
                {recommendationError} {/* Display the detailed error message */}
              </AlertDescription>
           </Alert>
         </section>
       );
   }


  // Render recommendations if available and AI is configured
  if (aiAvailable === true && recommendations.length > 0) {
    return (
      <section>
         <Alert className="bg-secondary border-primary/50">
           <Lightbulb className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Recommended For You</AlertTitle>
          <AlertDescription>
            Based on your activity, you might like these:
             <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {recommendations.map((product) => (
                 <ProductCard key={product.id} product={product} onRemove={() => { /* Handle remove in recommendation context if needed */ }} />
               ))}
            </div>
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  // Return null or a placeholder if no recommendations and no error/loading,
  // or if AI is available but there were no recommendations (e.g., insufficient history)
  if (aiAvailable === true && recommendations.length === 0 && !isLoadingRecommendations && !recommendationError) {
    // Optionally, show a message indicating no recommendations based on current data
    // console.log("No recommendations to display based on current activity.");
    return null; // Don't show the section if there's nothing to recommend and no error
  }

  // Fallback case: If loading is done but AI state is still null (should be rare)
  if (!isLoadingRecommendations && aiAvailable === null) {
     console.warn("Recommendation component finished loading but AI availability is undetermined.");
     return null;
  }


  return null; // Default return null if none of the above conditions are met
}
