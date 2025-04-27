
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/use-auth';
import { useCartStore } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; // Added CardFooter import
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreditCard, MapPin, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


export default function CheckoutPage() {
    const { isAuthenticated, user } = useAuthStore();
    const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        // If user is not authenticated or cart is empty, redirect them
        if (!isAuthenticated) {
             toast({
                title: "Login Required",
                description: "Please log in to proceed to checkout.",
                variant: "destructive",
             });
            router.push('/login');
        } else if (items.length === 0) {
             toast({
               title: "Cart Empty",
               description: "Cannot proceed to checkout with an empty cart.",
               variant: "destructive",
              });
            router.push('/cart');
        }
    }, [isAuthenticated, items, router, toast]);

    const handlePlaceOrder = () => {
        // Simulate placing the order
        console.log("Placing order for user:", user?.email, "Items:", items);
        // TODO: Implement actual order placement logic (API call, etc.)

        // Clear the cart after placing the order
        clearCart();

        // Show success toast
        toast({
             title: "Order Placed!",
             description: "Thank you for your purchase. Redirecting to home..."
            });

        // Redirect to an order confirmation page (or show a success message)
        // For now, redirect to home after a short delay
        setTimeout(() => {
            router.push('/');
        }, 1500); // Delay redirect slightly to allow toast visibility
    };

    // Show loading state while checking auth or cart
     if (!isAuthenticated || items.length === 0) {
        return (
          <div className="container mx-auto py-8">
            <Skeleton className="h-12 w-1/4 mb-6" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
              <div className="md:col-span-1">
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            </div>
          </div>
        );
    }

    const totalPrice = getTotalPrice();
    const totalItems = getTotalItems();

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {!user && (
                 <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Could not load user details. Please try logging in again.</AlertDescription>
                 </Alert>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                {/* Shipping & Payment Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center space-x-2">
                             <MapPin className="h-5 w-5 text-primary" />
                            <CardTitle>Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user ? (
                                <p>
                                    {user.name}<br />
                                    {/* Placeholder Address */}
                                    123 Pasal St,<br />
                                    Kathmandu, Bagmati 44600<br />
                                    Nepal
                                </p>
                            ) : (
                                <Skeleton className="h-16 w-1/2" />
                            )}
                            <Button variant="outline" size="sm" className="mt-4">Change Address</Button>
                             {/* TODO: Add address form/selection */}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center space-x-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Cash on Delivery (Default)</p>
                            <Button variant="outline" size="sm" className="mt-4">Change Payment Method</Button>
                            {/* TODO: Add payment method selection (eSewa, Khalti, Card) */}
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="md:col-span-1">
                    <Card className="shadow-lg sticky top-24">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <Separator />
                             <div className="flex justify-between">
                              <span>Subtotal ({totalItems} items)</span>
                              <span>Rs. {totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span className="text-primary">Free</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>Rs. {totalPrice.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handlePlaceOrder}>
                                Place Order
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
