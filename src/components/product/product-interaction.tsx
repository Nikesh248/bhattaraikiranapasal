
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/hooks/use-cart';
import { useToast } from "@/hooks/use-toast";

interface ProductInteractionProps {
  product: Product;
}

export default function ProductInteraction({ product }: ProductInteractionProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const { toast } = useToast();

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + change;
      // Ensure quantity is at least 1 and does not exceed stock
      return Math.max(1, Math.min(newQuantity, product.stock));
    });
  };

  const handleAddToCart = () => {
    // Prevent adding 0 stock items (though button should be disabled)
    if (product.stock <= 0) {
        toast({
            variant: "destructive",
            title: "Out of Stock",
            description: `${product.name} is currently out of stock.`,
          });
        return;
    }
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
    // Optionally reset quantity after adding, or keep it for potential further additions
    // setQuantity(1);
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium">Quantity:</span>
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || product.stock <= 0}
            aria-label={`Decrease quantity of ${product.name}`}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center font-medium tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product.stock || product.stock <= 0}
            aria-label={`Increase quantity of ${product.name}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
        onClick={handleAddToCart}
        disabled={product.stock <= 0} // Disable button if product is out of stock
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </Button>
    </>
  );
}
