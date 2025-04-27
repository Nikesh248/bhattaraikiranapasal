
import type { Product } from '@/types';

// Note: Local file paths like "C:\Users\..." cannot be used directly in web applications.
// We are using placeholder images from picsum.photos.
// To use specific images, they need to be hosted online or placed in the public directory of the Next.js app.

export const mockProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Organic Apples',
    description: 'Fresh and juicy organic apples, perfect for snacking.',
    price: 2.50,
    // Replacing placeholder with user provided image URL
    imageUrl: 'https://www.coca-cola.com/content/dam/onexp/us/en/brands/coca-cola-original/en_coca-cola_mobilebanner_original%20taste_654x1164_v1.jpg/width1338.jpg',
    category: 'Groceries',
    stock: 100,
  },
  {
    id: 'prod_002',
    name: 'Wireless Headphones',
    description: 'High-fidelity wireless headphones with noise cancellation.',
    price: 149.99,
    imageUrl: 'https://picsum.photos/seed/headphones/400/300',
    category: 'Electronics',
    stock: 50,
  },
  {
    id: 'prod_003',
    name: 'Coca-Cola', // Changed name to match image request
    description: 'Refreshing Coca-Cola soft drink.', // Changed description
    price: 1.50, // Adjusted price
    // Using the placeholder image intended for Coca-Cola
    imageUrl: 'https://picsum.photos/seed/coca_cola/400/300',
    category: 'Groceries',
    stock: 150,
  },
  {
    id: 'prod_004',
    name: 'Whole Wheat Bread',
    description: 'Healthy and delicious whole wheat bread loaf.',
    price: 3.00,
    imageUrl: 'https://picsum.photos/seed/bread/400/300',
    category: 'Groceries',
    stock: 80,
  },
  {
    id: 'prod_005',
    name: 'Smart LED Bulb',
    description: 'Energy-efficient smart LED bulb controllable via app.',
    price: 15.99,
    imageUrl: 'https://picsum.photos/seed/bulb/400/300',
    category: 'Electronics',
    stock: 150,
  },
  {
    id: 'prod_006',
    name: 'Running Shoes',
    description: 'Lightweight and supportive running shoes for men and women.',
    price: 79.99,
    imageUrl: 'https://picsum.photos/seed/pasal_shoes/400/300', // Changed seed back to original request
    category: 'Fashion',
    stock: 75,
  },
   {
    id: 'prod_007',
    name: 'Fresh Milk',
    description: 'One liter of fresh pasteurized milk.',
    price: 1.80,
    imageUrl: 'https://picsum.photos/seed/milk/400/300',
    category: 'Groceries',
    stock: 120,
  },
  {
    id: 'prod_008',
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with long battery life.',
    price: 45.50,
    imageUrl: 'https://picsum.photos/seed/speaker/400/300',
    category: 'Electronics',
    stock: 60,
  },
   {
    id: 'prod_009',
    name: 'Blue Jeans',
    description: 'Classic fit blue jeans made from durable denim.',
    price: 55.00,
    imageUrl: 'https://picsum.photos/seed/jeans/400/300',
    category: 'Fashion',
    stock: 90,
  },
  {
    id: 'prod_010',
    name: 'Scented Candle',
    description: 'Relaxing lavender scented candle for your home.',
    price: 12.00,
    imageUrl: 'https://picsum.photos/seed/candle/400/300',
    category: 'Home',
    stock: 180,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  // Ensure case-insensitive comparison for category filtering
  const lowerCaseCategory = category.toLowerCase();
  return mockProducts.filter(p => p.category.toLowerCase() === lowerCaseCategory);
};

export const searchProducts = (query: string): Product[] => {
  if (!query) return mockProducts; // Return all if query is empty
  const lowerCaseQuery = query.toLowerCase();
  return mockProducts.filter(
    p =>
      p.name.toLowerCase().includes(lowerCaseQuery) ||
      p.description.toLowerCase().includes(lowerCaseQuery) ||
      p.category.toLowerCase().includes(lowerCaseQuery)
  );
};

export const getCategories = (): string[] => {
    const categories = new Set(mockProducts.map(p => p.category));
    return Array.from(categories);
};
