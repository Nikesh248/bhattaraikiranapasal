'use client';

import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Trash2 } from 'lucide-react'; // Import Trash2 icon
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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { user, isAuthenticated } = useAuthStore(); // Get user and auth state
  const { toast } = useToast();

  // Simple mock admin check - replace with real logic if needed
  const isAdmin = isAuthenticated && user?.email === 'admin@pasal.com';

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveProduct = async () => {
    // In a real application, you would call a Server Action here
    // to remove the product from the database and revalidate the path.
    console.log(`Simulating removal of product: ${product.name} (ID: ${product.id}) by admin: ${user?.email}`);

    // TODO: Implement Server Action for actual removal
    // Example (pseudo-code):
    // const result = await removeProductAction(product.id);
    // if (result.success) {
    //   toast({ title: "Product Removed", description: `${product.name} has been removed.` });
    //   // Revalidation would happen in the server action, triggering UI update
    // } else {
    //   toast({ variant: "destructive", title: "Removal Failed", description: result.error });
    // }

    // Simulate success for now
    toast({
      title: "Product Removed (Simulated)",
      description: `${product.name} has been removed. Refresh to see changes.`,
      variant: "destructive"
    });
    // Note: This simulation doesn't update the UI automatically without page refresh
    // because we are not actually removing data and revalidating.
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
               >
                 <Trash2 className="h-4 w-4" />
               </Button>
             </AlertDialogTrigger>
             <AlertDialogContent>
               <AlertDialogHeader>
                 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                 <AlertDialogDescription>
                   This action cannot be undone. This will permanently remove the product
                   "{product.name}" from the store (simulation only).
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel>Cancel</AlertDialogCancel>
                 {/* Call handleRemoveProduct on confirmation */}
                 <AlertDialogAction onClick={handleRemoveProduct} className="bg-destructive hover:bg-destructive/90">
                    Remove Product
                 </AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
         )}
      </CardFooter>
    </Card>
  );
}
