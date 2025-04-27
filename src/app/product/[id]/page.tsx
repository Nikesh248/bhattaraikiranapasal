'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import { getProductById } from '@/lib/data';
import { useCartStore } from '@/hooks/use-cart';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);
   const { toast } = useToast();

  useEffect(() => {
    const fetchedProduct = getProductById(params.id);
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    } else {
      // Handle not found case properly in client component
      // For now, just log it. In a real app, you might redirect or show a message.
      console.error("Product not found");
      // Consider using next/navigation's notFound() if applicable here,
      // though typically it's used in Server Components or during build time.
    }
    setIsLoading(false);
  }, [params.id]);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    // Render a not found message or redirect
    // notFound(); // This hook can only be used in Server Components
     return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">Sorry, we couldn't find the product you were looking for.</p>
        </div>
      );
  }

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + change, product.stock)));
  };

  const handleAddToCart = () => {
     addToCart(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart.`,
      });
  };

  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="grid md:grid-cols-2 gap-8 p-6">
        <CardHeader className="p-0">
          <div className="aspect-square relative w-full rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col justify-center">
          <CardTitle className="text-3xl font-bold mb-2">{product.name}</CardTitle>
          <CardDescription className="text-base text-muted-foreground mb-4">
            {product.description}
          </CardDescription>
          <p className="text-2xl font-bold text-primary mb-4">Rs. {product.price.toFixed(2)}</p>

           <p className="text-sm text-muted-foreground mb-4">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
          </p>

          <Separator className="my-4" />

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || product.stock <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(1)}
                 disabled={quantity >= product.stock || product.stock <= 0}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
             size="lg"
             className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
             onClick={handleAddToCart}
             disabled={product.stock <= 0}
            >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </CardContent>
      </div>
       {/* TODO: Add Related Products Section */}
    </Card>
  );
}


function ProductSkeleton() {
  return (
     <Card className="overflow-hidden shadow-lg">
      <div className="grid md:grid-cols-2 gap-8 p-6">
        <CardHeader className="p-0">
          <Skeleton className="aspect-square w-full rounded-lg" />
        </CardHeader>
        <CardContent className="p-0 flex flex-col justify-center space-y-4">
           <Skeleton className="h-8 w-3/4 rounded" />
           <Skeleton className="h-16 w-full rounded" />
           <Skeleton className="h-8 w-1/4 rounded" />
           <Skeleton className="h-4 w-1/5 rounded" />
          <Separator className="my-4" />
           <div className="flex items-center gap-4">
             <Skeleton className="h-8 w-20 rounded" />
             <Skeleton className="h-8 w-24 rounded" />
           </div>
          <Skeleton className="h-12 w-full md:w-48 rounded-lg" />
         </CardContent>
       </div>
     </Card>
  );
}
