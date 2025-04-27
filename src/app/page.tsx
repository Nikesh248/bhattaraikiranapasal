'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Image
import ProductCard from '@/components/product/product-card';
import { mockProducts } from '@/lib/data';
import type { Product, Recommendation } from '@/types';
import { useCartStore } from '@/hooks/use-cart';
import { recommendProducts } from '@/ai/flows/product-recommendations';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const searchHistory = useCartStore((state) => state.searchHistory);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    // Simple logic to pick first few products as featured
    setFeaturedProducts(mockProducts.slice(0, 6));
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (searchHistory.length === 0) {
        setRecommendations([]); // No history, no recommendations
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
        // Map AI recommendations to Product objects
        const recommendedProducts = result.recommendations
          .map(recName => mockProducts.find(p => p.name.toLowerCase() === recName.toLowerCase()))
          .filter((p): p is Product => p !== undefined); // Filter out undefined results

        setRecommendations(recommendedProducts);

      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendationError("Could not load recommendations at this time.");
        setRecommendations([]);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [searchHistory, cartItems]); // Re-fetch when search history or cart changes

  return (
    <div className="space-y-12">
      {/* Banner Image */}
      <section className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="https://picsum.photos/seed/pasal_banner/1200/400" // Placeholder banner image
          alt="Bhattarai Kirana Pasal Banner"
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
          priority // Prioritize loading for the banner
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
           <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-md px-4">
              Welcome to Bhattarai Kirana Pasal
            </h1>
        </div>
      </section>


      {recommendations.length > 0 && !isLoadingRecommendations && (
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
      )}

      {isLoadingRecommendations && searchHistory.length > 0 && (
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
      )}

       {recommendationError && (
         <section>
           <Alert variant="destructive">
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{recommendationError}</AlertDescription>
           </Alert>
         </section>
       )}

      <section>
        <h2 className="text-3xl font-bold mb-6 text-primary">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Add sections for New Arrivals, Popular Products etc. if needed */}
       <section>
        <h2 className="text-3xl font-bold mb-6 text-primary">All Products</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {mockProducts.map((product) => (
             <ProductCard key={product.id} product={product} />
           ))}
         </div>
       </section>
    </div>
  );
}
