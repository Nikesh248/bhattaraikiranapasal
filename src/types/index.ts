
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Groceries' | 'Electronics' | 'Fashion' | 'Home';
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Recommendation {
  name: string;
}
