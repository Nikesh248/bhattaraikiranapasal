
'use client';

import React, { useEffect, useState } from 'react'; // Import React
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { History } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // Import Badge

// TODO: Define an Order type and fetch real order data
interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: { name: string; quantity: number }[];
}

export default function OrderHistoryPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Use useState directly
  const [orders, setOrders] = useState<Order[]>([]); // State to hold orders

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return; // Stop execution if redirecting
    }

    // Simulate fetching order data
    const fetchOrders = async () => {
      setIsLoading(true);
      // Replace with actual API call to fetch user's orders
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      // Mock data for now
      setOrders([
        { id: 'order_123', date: '2024-07-28', total: 55.50, status: 'Delivered', items: [{name: 'Organic Apples', quantity: 2}, {name: 'Wireless Headphones', quantity: 1}] },
        { id: 'order_456', date: '2024-07-25', total: 25.00, status: 'Shipped', items: [{name: 'Cotton T-Shirt', quantity: 1}] },
      ]);
      setIsLoading(false);
    };

    fetchOrders();

  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <History className="h-8 w-8 text-primary" /> Order History
        </h1>
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
          <History className="h-8 w-8 text-primary" /> Order History
       </h1>

       {orders.length === 0 ? (
         <Card>
           <CardContent className="pt-6 text-center text-muted-foreground">
             You haven't placed any orders yet.
           </CardContent>
         </Card>
       ) : (
         orders.map((order) => (
           <Card key={order.id} className="shadow-md">
             <CardHeader>
               <CardTitle className="text-lg flex justify-between items-center">
                 <span>Order ID: {order.id}</span>
                 <Badge className={`text-sm font-medium px-2 py-1 rounded-md ${
                   order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                   order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                   order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                   order.status === 'Pending' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                   'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' // Cancelled
                 }`} variant="secondary">
                   {order.status}
                 </Badge>
               </CardTitle>
               <CardDescription>Placed on: {new Date(order.date).toLocaleDateString()}</CardDescription>
                {/* Add delivery time message */}
               <p className="text-sm text-muted-foreground mt-1">
                 Your item will deliver within 24 hours.
               </p>
             </CardHeader>
             <CardContent>
               <p className="font-medium mb-2">Items:</p>
               <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-4">
                 {order.items.map((item, index) => (
                   <li key={index}>{item.name} (x{item.quantity})</li>
                 ))}
               </ul>
               <p className="font-semibold text-right">Total: Rs. {order.total.toFixed(2)}</p>
             </CardContent>
              {/* Optional: Add CardFooter for actions like "View Details" or "Reorder" */}
           </Card>
         ))
       )}
    </div>
  );
}
