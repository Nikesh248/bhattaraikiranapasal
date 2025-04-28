
import type { Metadata } from 'next';
import ProductCard from '@/components/product/product-card';
import { searchProducts } from '@/lib/data';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

// Server component props type including searchParams
interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generate metadata dynamically based on the search query
export async function generateMetadata(
  { searchParams }: SearchPageProps,
): Promise<Metadata> {
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';

  return {
    title: query ? `Search results for "${query}"` : 'Search Products',
    description: `Find products matching "${query}" at Bhattarai Kirana Pasal.`,
  };
}

// This is now a Server Component
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';

  // Fetch search results directly on the server
  // Add error handling if searchProducts could fail
  const results: Product[] = await searchProducts(query);

  // No need for isLoading, useState, or useEffect

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Search Results for "{query}"
      </h1>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-10">
            {query ? `No products found matching "${query}".` : 'Please enter a search term.'}
        </p>
      )}
    </div>
  );
}

// Example of a loading component if using Suspense (optional)
// export function SearchLoading() {
//   return (
//     <div>
//       <Skeleton className="h-10 w-1/3 mb-6 rounded" />
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {[...Array(8)].map((_, index) => (
//           <Skeleton key={index} className="h-[350px] w-full rounded-lg" />
//         ))}
//       </div>
//     </div>
//   );
// }
// You would use this with Suspense boundary in the layout/page structure.
