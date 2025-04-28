
import type { Metadata, ResolvingMetadata } from 'next';
import ProductCard from '@/components/product/product-card';
import { getProductsByCategory } from '@/lib/data';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton'; // Keep Skeleton for potential future use or consistency

// Helper function to capitalize first letter
const capitalize = (s: string | undefined): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

// Server component props type
interface CategoryPageProps {
  params: { name: string };
}

// Generate metadata dynamically based on the category
export async function generateMetadata(
  { params }: CategoryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const categoryName = params.name ? decodeURIComponent(params.name) : '';
  const displayCategoryName = capitalize(categoryName);

  return {
    title: `${displayCategoryName} Products - Bhattarai Kirana Pasal`,
    description: `Browse products in the ${displayCategoryName} category.`,
  };
}

// This is now a Server Component
export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = params.name ? decodeURIComponent(params.name) : '';
  const displayCategoryName = capitalize(categoryName);

  // Fetch products directly on the server
  // Consider adding error handling here if getProductsByCategory could fail
  const products: Product[] = await getProductsByCategory(displayCategoryName); // Assuming getProductsByCategory might become async

  // No need for isLoading state as data is fetched server-side before rendering
  // No need for useState or useEffect

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{displayCategoryName}</h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-10">No products found in this category.</p>
      )}
    </div>
  );
}

// Example of a loading component if using Suspense (optional)
// export function CategoryLoading() {
//   return (
//     <div>
//       <Skeleton className="h-10 w-1/4 mb-6 rounded" />
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {[...Array(8)].map((_, index) => (
//           <Skeleton key={index} className="h-[350px] w-full rounded-lg" />
//         ))}
//       </div>
//     </div>
//   );
// }
// You would use this with Suspense boundary in a parent layout/page if needed.
