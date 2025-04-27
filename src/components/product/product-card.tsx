'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/hooks/use-cart';
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/product/${product.id}`} className="block">
        <CardHeader className="p-0">
          <div className="aspect-video relative w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold mb-1 line-clamp-1">{product.name}</CardTitle>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
          <p className="text-lg font-bold text-primary">Rs. {product.price.toFixed(2)}</p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button
           onClick={handleAddToCart}
           className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
           disabled={product.stock <= 0}
         >
           <ShoppingCart className="mr-2 h-4 w-4" />
           {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
         </Button>
      </CardFooter>
    </Card>
  );
}
