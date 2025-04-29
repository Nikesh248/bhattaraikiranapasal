
'use client';

import { useState } from 'react';
import type { Product } from '@/types';
import ProductCard from '@/components/product/product-card';

interface ProductListProps {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Callback function to remove a product from the client-side state
  const handleRemoveProductFromList = (productId: string) => {
    setProducts((currentProducts) =>
      currentProducts.filter((p) => p.id !== productId)
    );
  };

  if (!products || products.length === 0) {
    return <p className="text-muted-foreground">No products available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onRemove={handleRemoveProductFromList} // Pass the callback
        />
      ))}
    </div>
  );
}
