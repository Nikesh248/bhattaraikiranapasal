'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/hooks/use-cart';
import type { CartItem } from '@/types';
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { toast } = useToast();

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
      if (validatedQuantity !== newQuantity) {
       toast({
         title: "Quantity Limited",
         description: `Maximum stock for ${item.name} is ${item.stock}.`,
         variant: "destructive",
       });
     }
      updateQuantity(item.id, validatedQuantity);
    };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your Shopping Cart ({totalItems} items)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {items.length === 0 ? (
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
                          className="h-8 w-12 text-center border-0 focus-visible:ring-0 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                          aria-label={`Quantity for ${item.name}`}
                        />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
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
             {items.length > 0 && (
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
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-primary">Free</span> {/* Or calculate shipping */}
            </div>
             <div className="flex justify-between">
              <span>Discount Code</span>
               <Button variant="link" className="p-0 h-auto text-primary">Apply</Button> {/* TODO: Implement discount codes */}
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Rs. {totalPrice.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={items.length === 0}>
              Proceed to Checkout
            </Button>
            {/* Link to checkout page: <Link href="/checkout"><Button>...</Button></Link> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
