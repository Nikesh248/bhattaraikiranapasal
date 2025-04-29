
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/use-auth';
import { useCartStore } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Import Input
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"; // Import Dialog components
import { CreditCard, MapPin, AlertCircle, Banknote, Landmark } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link'; // Import Link
import { sendOrderConfirmationEmail } from '@/ai/flows/send-order-confirmation-email'; // Import the email sending flow

interface AddressFormData {
    name: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    phoneNumber: string;
}


export default function CheckoutPage() {
    const { isAuthenticated, user } = useAuthStore();
    const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
    const router = useRouter();
    const { toast } = useToast();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash'); // State for payment method
    const [isClient, setIsClient] = useState(false);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false); // State for address dialog
    const [isLoading, setIsLoading] = useState(false); // Add loading state for place order

    // Mock address - replace with actual user address logic later
    const [currentAddress, setCurrentAddress] = useState({
        name: "Loading...",
        address: "123 Pasal St",
        city: "Kathmandu",
        province: "Bagmati",
        postalCode: "44600",
        phoneNumber: "98XXXXXXXX", // Placeholder phone number
    });

    // Initialize form data with current address when dialog opens
    const [addressFormData, setAddressFormData] = useState<AddressFormData>(currentAddress);

    useEffect(() => {
        // Update form data if user/currentAddress changes
        setAddressFormData({
            name: currentAddress.name,
            address: currentAddress.address,
            city: currentAddress.city,
            province: currentAddress.province,
            postalCode: currentAddress.postalCode,
            phoneNumber: currentAddress.phoneNumber,
        });
    }, [currentAddress]);


    // Define shipping cost
    const shippingCost = 150.00;

    useEffect(() => {
        setIsClient(true);
        // If user is not authenticated or cart is empty, redirect them
        if (!isAuthenticated) {
             toast({
                title: "Login Required",
                description: "Please log in to proceed to checkout.",
                variant: "destructive",
             });
            router.push('/login');
        } else if (items.length === 0 && router.asPath !== '/checkout') { // Avoid redirect loop if already on checkout
             toast({
               title: "Cart Empty",
               description: "Cannot proceed to checkout with an empty cart.",
               variant: "destructive",
              });
            router.push('/cart');
        }
        // Update currentAddress when user loads
         if (user) {
            setCurrentAddress(prev => ({
                ...prev,
                name: user.name,
                // You might want to fetch saved address here if available
                // For now, just update the name based on logged-in user
            }));
            setAddressFormData(prev => ({ ...prev, name: user.name }));
         } else if (isAuthenticated) {
            // Handle case where user data might still be loading or missing
             setCurrentAddress(prev => ({ ...prev, name: "User" })); // Default name if user object not fully loaded
             setAddressFormData(prev => ({ ...prev, name: "User" }));
         }

    }, [isAuthenticated, items, router, toast, user]);

    const subtotal = getTotalPrice();
    const totalItems = getTotalItems();
    const finalTotal = subtotal + shippingCost; // Calculate final total

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        try {
            // Simulate placing the order
            console.log("Placing order for user:", user?.email, "Items:", items, "Payment Method:", selectedPaymentMethod, "Shipping Address:", currentAddress, "Total:", finalTotal);

            // Send order confirmation email
            await sendOrderConfirmationEmail({
              recipientEmail: "nikeshdon66@gmail.com", // Hardcoded recipient
              userName: user?.name || 'Customer',
              userEmail: user?.email || 'N/A',
              orderItems: items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              subtotal: subtotal,
              shippingCost: shippingCost,
              totalAmount: finalTotal,
              paymentMethod: selectedPaymentMethod,
              shippingAddress: currentAddress,
            });

            // Clear the cart after placing the order
            clearCart();

            // Show success toast
            toast({
                title: "Order Placed!",
                description: `Thank you for your purchase! Confirmation sent. Redirecting...`,
                duration: 3000, // Give more time to read
            });

            // Redirect to home page after a short delay
            setTimeout(() => {
                router.push('/');
            }, 1500); // Delay redirect slightly to allow toast visibility

        } catch (error) {
             console.error("Error placing order or sending email:", error);
             toast({
               variant: "destructive",
               title: "Order Failed",
               description: "There was an issue placing your order. Please try again.",
             });
             setIsLoading(false); // Ensure loading state is turned off on error
        }
        // No finally block needed for setIsLoading(false) as it's handled on success redirect or explicit error catch
    };


    const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAddress = () => {
        // TODO: Validate addressFormData
        // TODO: Implement actual address saving logic (update useAuthStore, call API)
        console.log("Saving new address:", addressFormData);
        setCurrentAddress(addressFormData); // Update the displayed address
        setIsAddressDialogOpen(false); // Close the dialog
        toast({
            title: "Address Updated",
            description: "Your shipping address has been saved.",
        });
    };


    // Show loading state while checking auth or cart is empty (but allow viewing page if directly navigated)
     if (!isClient) { // Only show full skeleton if not authenticated or client not hydrated
        return (
          <div className="container mx-auto py-8">
            <Skeleton className="h-10 w-1/4 mb-6 rounded" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                {/* Skeleton for Address Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-6 w-32 rounded" />
                        </div>
                        <Skeleton className="h-8 w-24 rounded-md" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-1/2 mb-1 rounded" />
                        <Skeleton className="h-4 w-3/4 mb-1 rounded" />
                        <Skeleton className="h-4 w-2/3 mb-1 rounded" />
                        <Skeleton className="h-4 w-1/3 rounded" />
                    </CardContent>
                </Card>
                 {/* Skeleton for Payment Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center space-x-2">
                       <Skeleton className="h-5 w-5 rounded-full" />
                       <Skeleton className="h-6 w-40 rounded" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </CardContent>
                </Card>
              </div>
               {/* Skeleton for Order Summary Card */}
              <div className="md:col-span-1">
                <Card className="shadow-lg sticky top-24">
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2 rounded" />
                  </CardHeader>
                   <CardContent className="space-y-3">
                       <Skeleton className="h-4 w-full rounded" />
                       <Skeleton className="h-4 w-3/4 rounded" />
                       <Separator />
                       <Skeleton className="h-5 w-1/2 rounded" />
                       <Skeleton className="h-5 w-1/3 rounded" />
                       <Separator />
                       <Skeleton className="h-6 w-1/4 rounded" />
                       <Skeleton className="h-6 w-1/3 ml-auto rounded" />
                   </CardContent>
                  <CardFooter>
                     <Skeleton className="h-12 w-full rounded-md" />
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        );
    }

     // Handle case where cart becomes empty after reaching checkout
      if (items.length === 0 && isAuthenticated) {
         return (
             <div className="container mx-auto py-8 text-center">
                 <h1 className="text-3xl font-bold mb-6">Checkout</h1>
                 <Alert variant="destructive">
                   <AlertCircle className="h-4 w-4" />
                   <AlertTitle>Cart Empty</AlertTitle>
                   <AlertDescription>
                     Your cart is empty. Please add items before checking out.
                     <Button onClick={() => router.push('/')} className="mt-4">Continue Shopping</Button>
                   </AlertDescription>
                 </Alert>
             </div>
         );
      }


    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {!user && isAuthenticated && ( // Show warning if user details missing but authenticated
                 <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Could not load user details. Order might proceed but user info may be missing.</AlertDescription>
                 </Alert>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                {/* Shipping & Payment Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                             <div className="flex items-center space-x-2">
                                 <MapPin className="h-5 w-5 text-primary" />
                                 <CardTitle>Shipping Address</CardTitle>
                             </div>
                              {/* Dialog Trigger Button */}
                              <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                                 <DialogTrigger asChild>
                                   <Button variant="outline" size="sm">Change Address</Button>
                                 </DialogTrigger>
                                 <DialogContent className="sm:max-w-[425px]">
                                     <DialogHeader>
                                       <DialogTitle>Edit Shipping Address</DialogTitle>
                                       <DialogDescription>
                                         Update your shipping information here. Click save when you're done.
                                       </DialogDescription>
                                     </DialogHeader>
                                     <div className="grid gap-4 py-4">
                                       {/* Form Fields */}
                                       <div className="grid grid-cols-4 items-center gap-4">
                                           <Label htmlFor="name" className="text-right">Name</Label>
                                           <Input id="name" name="name" value={addressFormData.name} onChange={handleAddressFormChange} className="col-span-3" />
                                       </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                           <Label htmlFor="address" className="text-right">Address</Label>
                                           <Input id="address" name="address" value={addressFormData.address} onChange={handleAddressFormChange} className="col-span-3" />
                                       </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                           <Label htmlFor="city" className="text-right">City</Label>
                                           <Input id="city" name="city" value={addressFormData.city} onChange={handleAddressFormChange} className="col-span-3" />
                                       </div>
                                       <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="province" className="text-right">Province</Label>
                                           <Input id="province" name="province" value={addressFormData.province} onChange={handleAddressFormChange} className="col-span-3" />
                                       </div>
                                       <div className="grid grid-cols-4 items-center gap-4">
                                           <Label htmlFor="postalCode" className="text-right">Postal Code</Label>
                                           <Input id="postalCode" name="postalCode" value={addressFormData.postalCode} onChange={handleAddressFormChange} className="col-span-3" />
                                       </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                           <Label htmlFor="phoneNumber" className="text-right">Phone</Label>
                                           <Input id="phoneNumber" name="phoneNumber" value={addressFormData.phoneNumber} onChange={handleAddressFormChange} className="col-span-3" />
                                       </div>
                                     </div>
                                     <DialogFooter>
                                       <DialogClose asChild>
                                           <Button type="button" variant="secondary">Cancel</Button>
                                       </DialogClose>
                                       <Button type="button" onClick={handleSaveAddress}>Save changes</Button>
                                     </DialogFooter>
                                 </DialogContent>
                               </Dialog>
                        </CardHeader>
                        <CardContent>
                             {isClient ? (
                                <div>
                                    <p className="font-medium">{currentAddress.name}</p>
                                    <p className="text-muted-foreground">{currentAddress.address}</p>
                                    <p className="text-muted-foreground">{currentAddress.city}, {currentAddress.province} {currentAddress.postalCode}</p>
                                    <p className="text-muted-foreground">Nepal</p>
                                     <p className="text-muted-foreground">Phone: {currentAddress.phoneNumber}</p>
                                </div>
                            ) : (
                                // Keep skeleton simple here as it's covered by the main page skeleton
                                <Skeleton className="h-16 w-1/2" />
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center space-x-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-3">
                                <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-secondary/50 transition-colors">
                                    <RadioGroupItem value="cash" id="cash" />
                                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-grow">
                                        <Banknote className="h-5 w-5 text-green-600" /> Cash on Delivery
                                    </Label>
                                </div>
                                 <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-secondary/50 transition-colors">
                                    <RadioGroupItem value="esewa" id="esewa" />
                                     {/* Placeholder SVG for eSewa */}
                                     <Label htmlFor="esewa" className="flex items-center gap-2 cursor-pointer flex-grow">
                                        <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M88.293 111.819H39.707a4.001 4.001 0 0 1-3.835-5.159l14.25-42.748a4 4 0 0 1 3.835-2.84h30.136a4 4 0 0 1 3.835 2.84l14.25 42.749a4.001 4.001 0 0 1-3.835 5.158Z" fill="#61BC47"></path><path d="M117.22 48.599 94.803 42.12a4 4 0 0 0-4.421 1.316L68.57 68.044H59.43L37.618 43.436a4 4 0 0 0-4.421-1.316L10.78 48.6a4.001 4.001 0 0 0-2.78 4.82l10.38 31.14h101.24l10.38-31.14a4.001 4.001 0 0 0-2.78-4.821Z" fill="#84C44F"></path><path d="M64 52.818a12.181 12.181 0 1 1 0-24.363 12.181 12.181 0 0 1 0 24.363Z" fill="#60BA46"></path><path d="M64 22.455a12.181 12.181 0 1 1 0-24.364A12.181 12.181 0 0 1 64 22.455Z" fill="#84C44F"></path></svg>
                                         eSewa
                                     </Label>
                                </div>
                                 <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-secondary/50 transition-colors">
                                    <RadioGroupItem value="khalti" id="khalti" />
                                    {/* Placeholder SVG for Khalti */}
                                    <Label htmlFor="khalti" className="flex items-center gap-2 cursor-pointer flex-grow">
                                         <svg width="20" height="20" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M78.678 83.61 55.433 109.51c-1.284 1.403-3.226 2.302-5.333 2.418-2.106.116-4.146-.63-5.682-2.07L29.376 96.99a6.88 6.88 0 0 1-.217-9.683L64.895 50.49c1.284-1.403 3.226-2.302 5.333-2.418 2.106-.116 4.146.63 5.682 2.07l15.042 12.868a6.88 6.88 0 0 1 .217 9.683Z" fill="#5D2E8E"></path><path d="m104.57 50.49-35.736 36.817a6.88 6.88 0 0 0-.217 9.683l15.042 12.868c1.536 1.44 3.576 2.185 5.682 2.07 2.107-.116 4.049-1.015 5.333-2.418l23.245-25.9c1.284-1.403 1.945-3.215 1.788-5.045-.158-1.83-.994-3.538-2.31-4.824L104.57 50.49Z" fill="#FFF" fillOpacity=".9"></path></svg>
                                         Khalti
                                    </Label>
                                </div>
                                 <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-secondary/50 transition-colors">
                                    <RadioGroupItem value="bank" id="bank" />
                                    <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer flex-grow">
                                        <Landmark className="h-5 w-5 text-blue-600" /> Bank Transfer
                                    </Label>
                                </div>
                            </RadioGroup>
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
                             {isClient ? (
                                <>
                                    {items.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <Separator />
                                    <div className="flex justify-between">
                                    <span>Subtotal ({totalItems} items)</span>
                                    <span>Rs. {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                    <span>Shipping</span>
                                    {/* Display shipping cost */}
                                    <span>Rs. {shippingCost.toFixed(2)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        {/* Display final total */}
                                        <span>Rs. {finalTotal.toFixed(2)}</span>
                                    </div>
                                </>
                                ) : (
                                    // Keep skeleton simple here as it's covered by the main page skeleton
                                    <div className="space-y-3">
                                       <Skeleton className="h-4 w-full rounded" />
                                       <Skeleton className="h-4 w-3/4 rounded" />
                                       <Separator />
                                       <Skeleton className="h-5 w-1/2 rounded" />
                                       <Skeleton className="h-5 w-1/3 rounded" />
                                       <Separator />
                                       <Skeleton className="h-6 w-1/4 rounded" />
                                       <Skeleton className="h-6 w-1/3 ml-auto rounded" />
                                    </div>
                                )}
                        </CardContent>
                        <CardFooter>
                            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handlePlaceOrder} disabled={!isClient || items.length === 0 || isLoading}>
                                {isLoading ? 'Placing Order...' : (isClient && items.length > 0 ? 'Place Order' : 'Loading...')}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
