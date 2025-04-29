
'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Trash2, Loader2 } from 'lucide-react'; // Import Loader2
import { useCartStore } from '@/hooks/use-cart';
import { useAuthStore } from '@/hooks/use-auth'; // Import useAuthStore
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog" // Import AlertDialog
import { removeProductAction } from '@/actions/remove-product'; // Import the server action
import { useState } from 'react'; // Import useState

interface ProductCardProps {
  product: Product;
  onRemove?: (productId: string) => void; // Add optional callback prop
}

export default function ProductCard({ product, onRemove }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { user, isAuthenticated } = useAuthStore(); // Get user and auth state
  const { toast } = useToast();
  const [isRemoving, setIsRemoving] = useState(false); // State for loading indicator

  // Simple mock admin check - replace with real logic if needed
  const isAdmin = isAuthenticated && user?.email === 'admin@pasal.com';

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleConfirmRemove = async () => {
    if (!isAdmin) return; // Should not happen if button isn't rendered, but good practice

    setIsRemoving(true); // Show loading state

    try {
        // Call the server action to remove the product from the backend
        const result = await removeProductAction(product.id);

        if (result.success) {
            toast({
                title: "Product Removed",
                description: `${product.name} has been removed successfully.`,
            });
            // Call the onRemove callback to update the parent component's state
            onRemove?.(product.id);
            // No need to setIsRemoving(false) here as the component will unmount
        } else {
            toast({
                variant: "destructive",
                title: "Removal Failed",
                description: result.error || "Could not remove the product.",
            });
            setIsRemoving(false); // Hide loading state on failure
        }
    } catch (error) {
        console.error("Error calling removeProductAction:", error);
        toast({
            variant: "destructive",
            title: "Removal Error",
            description: "An unexpected error occurred while trying to remove the product.",
        });
        setIsRemoving(false); // Hide loading state on unexpected error
    }
};


  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
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
      <CardFooter className="p-4 pt-0 mt-auto flex gap-2">
        <Button
           onClick={handleAddToCart}
           className="flex-grow bg-accent hover:bg-accent/90 text-accent-foreground"
           disabled={product.stock <= 0}
           aria-label={`Add ${product.name} to cart`}
         >
           <ShoppingCart className="mr-2 h-4 w-4" />
           {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
         </Button>

         {/* Conditionally render Remove button for admins */}
         {isAdmin && (
           <AlertDialog>
             <AlertDialogTrigger asChild>
               <Button
                 variant="destructive"
                 size="icon"
                 className="flex-shrink-0"
                 aria-label={`Remove ${product.name}`}
                 disabled={isRemoving} // Disable trigger while removing
               >
                  {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
               </Button>
             </AlertDialogTrigger>
             <AlertDialogContent>
               <AlertDialogHeader>
                 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                 <AlertDialogDescription>
                   This action cannot be undone. This will permanently remove the product
                   "{product.name}" from the store.
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
                 {/* Call handleConfirmRemove on confirmation */}
                 <AlertDialogAction
                    onClick={handleConfirmRemove}
                    className="bg-destructive hover:bg-destructive/90"
                    disabled={isRemoving}
                  >
                    {isRemoving ? (
                        <>
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         Removing...
                        </>
                    ) : (
                         'Remove Product'
                    )}
                 </AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
         )}
      </CardFooter>
    </Card>
  );
}
