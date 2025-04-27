
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/hooks/use-cart';
import { useAuthStore } from '@/hooks/use-auth'; // Import useAuthStore
import type { CartItem } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export default function CartPage() {
  const router = useRouter(); // Initialize useRouter
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore(); // Get authentication status
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false); // Add isClient state

  const shippingCost = 150.00; // Define shipping cost

  useEffect(() => {
    // This effect runs only on the client after initial render
    setIsClient(true);
  }, []);


  const handleRemove = (item: CartItem) => {
     removeFromCart(item.id);
      toast({
        title: "Item Removed",
        description: `${item.name} has been removed from your cart.`,
        variant: "destructive",
      });
  };

  const handleClearCart = () => {
      clearCart();
       toast({
         title: "Cart Cleared",
         description: "Your shopping cart has been emptied.",
         variant: "destructive",
       });
    };


  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
      const validatedQuantity = Math.max(1, Math.min(newQuantity, item.stock));
      if (validatedQuantity !== newQuantity && newQuantity > item.stock) {
       toast({
         title: "Quantity Limited",
         description: `Maximum stock for ${item.name} is ${item.stock}.`,
         variant: "destructive",
       });
     }
      updateQuantity(item.id, validatedQuantity);
    };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
       toast({
         title: "Login Required",
         description: "Please log in to proceed to checkout.",
         variant: "destructive",
       });
      router.push('/login'); // Redirect to login page if not authenticated
    } else {
      if (items.length === 0) {
         toast({
           title: "Cart Empty",
           description: "Your cart is empty. Add items before checking out.",
           variant: "destructive",
         });
        return;
      }
      // User is authenticated and cart is not empty, proceed to checkout
      router.push('/checkout'); // TODO: Create checkout page/flow
       toast({
         title: "Proceeding to Checkout",
         description: "Redirecting you to the checkout page...",
       });
    }
  };

  // Calculate totals after client-side mount
  const subtotal = isClient ? getTotalPrice() : 0;
  const totalItemsCount = isClient ? getTotalItems() : 0;
  const finalTotal = isClient ? subtotal + shippingCost : 0;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card className="shadow-lg">
          <CardHeader>
            {/* Conditionally render totalItemsCount */}
            <CardTitle className="text-2xl font-bold">
              Your Shopping Cart {isClient ? `(${totalItemsCount} items)` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Show skeleton or message while loading */}
            {!isClient ? (
               <div className="space-y-4">
                 <div className="flex gap-4 border-b pb-4">
                   <Skeleton className="h-20 w-20 rounded-md bg-muted animate-pulse" />
                   <div className="flex-grow space-y-2">
                      <Skeleton className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                      <Skeleton className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                      <Skeleton className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                   </div>
                   <div className="flex items-center gap-2 ml-auto">
                      <Skeleton className="h-8 w-24 bg-muted animate-pulse rounded-md" />
                       <Skeleton className="h-8 w-8 bg-muted animate-pulse rounded-md" />
                   </div>
                 </div>
               </div>
             ) : items.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-4 last:border-b-0">
                  <div className="relative h-24 w-24 sm:h-20 sm:w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <Link href={`/product/${item.id}`} className="font-semibold hover:text-primary">{item.name}</Link>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="text-sm font-medium">Rs. {item.price.toFixed(2)}</p>
                     {item.stock < 5 && item.stock > 0 && (
                       <p className="text-xs text-destructive mt-1">Only {item.stock} left in stock!</p>
                     )}
                     {item.stock === 0 && (
                      <p className="text-xs text-destructive mt-1">Out of stock</p>
                     )}
                  </div>
                  <div className="flex items-center gap-2 sm:ml-auto">
                     <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                          type="number"
                          min="1"
                          max={item.stock}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item, parseInt(e.target.value, 10) || 1)}
                           onBlur={(e) => { // Ensure quantity doesn't exceed stock on blur
                             const val = parseInt(e.target.value, 10) || 1;
                             handleQuantityChange(item, Math.min(val, item.stock));
                            }}
                          className="h-8 w-12 text-center border-0 focus-visible:ring-0 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                          aria-label={`Quantity for ${item.name}`}
                          disabled={item.stock === 0}
                        />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        disabled={item.quantity >= item.stock || item.stock === 0}
                         aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(item)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-5 w-5" />
                      <span className="sr-only">Remove {item.name}</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
             {isClient && items.length > 0 && ( // Only show clear cart button on client when items exist
               <div className="flex justify-end mt-4">
                 <Button variant="outline" onClick={handleClearCart} className="text-destructive border-destructive hover:bg-destructive/10">
                    Clear Cart
                  </Button>
               </div>
              )}
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card className="shadow-lg sticky top-24">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             {/* Show skeleton while loading */}
             {!isClient ? (
               <div className="space-y-3">
                  <Skeleton className="h-4 w-2/5 rounded" />
                  <Skeleton className="h-4 w-1/5 ml-auto rounded" />
                  <Skeleton className="h-4 w-1/4 rounded" />
                  <Skeleton className="h-4 w-1/6 ml-auto rounded" />
                  <Separator />
                  <Skeleton className="h-6 w-1/5 rounded" />
                  <Skeleton className="h-6 w-1/4 ml-auto rounded" />
               </div>
             ) : (
                <>
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItemsCount} items)</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Rs. {shippingCost.toFixed(2)}</span> {/* Display shipping cost */}
                  </div>
                   <div className="flex justify-between">
                    <span>Discount Code</span>
                     <Button variant="link" className="p-0 h-auto text-primary">Apply</Button> {/* TODO: Implement discount codes */}
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>Rs. {finalTotal.toFixed(2)}</span> {/* Display final total */}
                  </div>
               </>
            )}
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={!isClient || items.length === 0} // Disable button until client hydrated and cart has items
              onClick={handleProceedToCheckout} // Add onClick handler
            >
              Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
