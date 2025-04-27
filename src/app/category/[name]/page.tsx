'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/product/product-card';
import { getProductsByCategory } from '@/lib/data';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to capitalize first letter
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function CategoryPage() {
  const params = useParams<{ name: string }>();
  const categoryName = params.name ? decodeURIComponent(params.name) : '';
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
     if (categoryName) {
      // Simulate API call delay
      const timer = setTimeout(() => {
         const categoryProducts = getProductsByCategory(capitalize(categoryName)); // Ensure category name matches data
         setProducts(categoryProducts);
         setIsLoading(false);
      }, 300);
       return () => clearTimeout(timer);
    } else {
        setIsLoading(false);
        setProducts([]); // Handle case where categoryName might be invalid/empty
    }

  }, [categoryName]);

  const displayCategoryName = categoryName ? capitalize(categoryName) : 'Category';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{displayCategoryName}</h1>

       {isLoading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {[...Array(8)].map((_, index) => (
              <Skeleton key={index} className="h-[350px] w-full rounded-lg" />
           ))}
         </div>
       ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-10">No products found in this category.</p>
      )}
    </div>
  );
}
