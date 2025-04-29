
import { Suspense } from 'react'; // Import Suspense for loading UI
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/types';
import { getProductById } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import ProductInteraction from '@/components/product/product-interaction'; // Import the new client component
import type { Metadata, ResolvingMetadata } from 'next';

// Server component props type
interface ProductDetailsPageProps {
  params: { id: string };
}

// Generate metadata dynamically based on the product
export async function generateMetadata(
  { params }: ProductDetailsPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const productId = params.id;
  // Fetch product data - reuse the function or fetch logic
  const product = await getProductById(productId); // Assuming getProductById might become async

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} - Bhattarai Kirana Pasal`,
    description: product.description,
    openGraph: {
      images: [product.imageUrl],
    },
  };
}


// Main Server Component for the page layout and static content
async function ProductDetailsContent({ productId }: { productId: string }) {
  const product = await getProductById(productId); // Assuming getProductById might become async

  if (!product) {
    notFound(); // Use Next.js notFound utility
  }

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
              className="object-contain" // Use contain to prevent cropping if aspect ratio differs
              // Removed priority={true} - typically only one priority image per page (e.g., banner on home)
              loading="lazy" // Explicitly set lazy loading
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

          {/* Client Component for interactive elements */}
          <ProductInteraction product={product} />

        </CardContent>
      </div>
      {/* TODO: Add Related Products Section (could be fetched server-side) */}
    </Card>
  );
}

// The main page component remains simple, handling routing and Suspense
export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const productId = params.id;

  return (
    // Wrap the content in Suspense to show a loading state
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetailsContent productId={productId} />
    </Suspense>
  );
}


// Skeleton component remains the same
function ProductSkeleton() {
  return (
     <Card className="overflow-hidden shadow-lg">
      <div className="grid md:grid-cols-2 gap-8 p-6">
        <CardHeader className="p-0">
          <Skeleton className="aspect-square w-full rounded-lg bg-muted" />
        </CardHeader>
        <CardContent className="p-0 flex flex-col justify-center space-y-4">
           <Skeleton className="h-8 w-3/4 rounded bg-muted" />
           <Skeleton className="h-16 w-full rounded bg-muted" />
           <Skeleton className="h-8 w-1/4 rounded bg-muted" />
           <Skeleton className="h-4 w-1/5 rounded bg-muted" />
          <Separator className="my-4" />
           <div className="flex items-center gap-4">
             <Skeleton className="h-8 w-20 rounded bg-muted" />
             <Skeleton className="h-8 w-24 rounded bg-muted" />
           </div>
          <Skeleton className="h-12 w-full md:w-48 rounded-lg bg-muted" />
         </CardContent>
       </div>
     </Card>
  );
}

