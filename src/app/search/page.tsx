'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/product-card';
import { searchProducts } from '@/lib/data';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay for loading state demonstration
    const timer = setTimeout(() => {
      const products = searchProducts(query);
      setResults(products);
      setIsLoading(false);
    }, 300); // 300ms delay

    return () => clearTimeout(timer); // Cleanup timer on unmount or query change
  }, [query]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Search Results for "{query}"
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
             <Skeleton key={index} className="h-[350px] w-full rounded-lg" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-10">No products found matching your search.</p>
      )}
    </div>
  );
}
