
'use server';

import { removeProductById } from '@/lib/data'; // Import the (simulated) data removal function
import { revalidatePath } from 'next/cache'; // Import revalidatePath

interface ActionResult {
    success: boolean;
    error?: string;
}

// Server Action to remove a product
export async function removeProductAction(productId: string): Promise<ActionResult> {
    // TODO: Add admin authentication check here in a real application
    // For example:
    // const session = await auth(); // Using NextAuth.js or similar
    // if (!session?.user?.isAdmin) {
    //    return { success: false, error: 'Unauthorized' };
    // }

    try {
        // Call the function to remove the product from the data source
        const removed = await removeProductById(productId);

        if (removed) {
            // Revalidate the cache for the home page to reflect the change
            // Note: This helps if the page wasn't fully client-side rendered,
            // but with the ProductList client component, the main benefit
            // is ensuring subsequent visits see the updated data.
            revalidatePath('/');
            return { success: true };
        } else {
            return { success: false, error: 'Product not found or could not be removed.' };
        }
    } catch (error) {
        console.error(`Error removing product ${productId}:`, error);
        return { success: false, error: 'An internal server error occurred.' };
    }
}
