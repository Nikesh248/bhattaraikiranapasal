
import { Suspense } from 'react';
import Image from 'next/image';
import { getAllProducts } from '@/lib/data'; // Use async function to get all products
import { Skeleton } from '@/components/ui/skeleton';
import Recommendations from '@/components/recommendations'; // Import the client component
import ProductList from '@/components/product-list'; // Import the new client component

// --- Server Component ---
export default async function Home() {
  // Fetch all products directly on the server
  const rawAllProducts = await getAllProducts();

  // Filter out the specific product (if still needed, though it might be better removed from data.ts)
  const productIdToRemove = "prod_001";
  const allProducts = rawAllProducts.filter(p => p.id !== productIdToRemove);

  // Simulate fetching the "latest" products by taking the last N items
  const numberOfLatestProducts = 6;
  const latestProducts = allProducts.slice(-numberOfLatestProducts);

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

      {/* Latest Products Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-primary">Latest Products</h2>
        {/* Use ProductList to display the latest products */}
        <ProductList initialProducts={latestProducts} />
      </section>

      {/* Removed Featured Products Section */}
      {/* Removed All Products Section */}
    </div>
  );
}

// Skeleton for Recommendations section
function RecommendationsSkeleton() {
  return (
    <section>
       <div className="bg-secondary border-primary/50 p-4 rounded-lg">
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
