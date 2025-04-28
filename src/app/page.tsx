
import { Suspense } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/product/product-card';
import { getFeaturedProducts, getAllProducts } from '@/lib/data'; // Use async functions
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import Recommendations from '@/components/recommendations'; // Import the client component

// --- Server Component ---
export default async function Home() {
  // Fetch data directly on the server
  // Using Promise.all for concurrent fetching
  const [featuredProducts, allProducts] = await Promise.all([
    getFeaturedProducts(6),
    getAllProducts() // Fetch all products for the "All Products" section
  ]);

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

      {/* Client Component for Recommendations */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations />
      </Suspense>

      {/* Featured Products Section (Server Rendered) */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-primary">Featured Products</h2>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No featured products available.</p>
        )}
      </section>

      {/* All Products Section (Server Rendered) */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-primary">All Products</h2>
        {allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No products available.</p>
        )}
      </section>
    </div>
  );
}

// Skeleton for Recommendations section
function RecommendationsSkeleton() {
  return (
    <section>
       <div className="bg-secondary border border-primary/50 p-4 rounded-lg">
         <Skeleton className="h-6 w-1/3 mb-4 rounded" />
         <Skeleton className="h-4 w-2/3 mb-4 rounded" />
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[350px] w-full rounded-lg" />
            <Skeleton className="h-[350px] w-full rounded-lg" />
            <Skeleton className="h-[350px] w-full rounded-lg" />
         </div>
       </div>
    </section>
  );
}
