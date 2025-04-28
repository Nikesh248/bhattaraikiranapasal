
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// Note: We might need a separate auth store or method for admin login in a real app
// For now, we'll reuse the user auth store for simplicity, but this should be different.
// import { useAdminAuthStore } from '@/hooks/use-admin-auth'; // Example for a separate store
import { useAuthStore } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const adminLoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  // Replace with admin-specific login logic if needed
  const { login } = useAuthStore(); // Using user login for now
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call for admin verification
      await new Promise((resolve) => setTimeout(resolve, 500));

      // --- IMPORTANT ---
      // In a real application, you MUST verify admin credentials against a secure backend endpoint.
      // This mock logic is insecure and only for demonstration.
      // Example check (highly insecure, replace with backend verification):
      if (data.email === 'admin@pasal.com' && data.password === 'admin123') { // Updated credentials
        // Use a dedicated admin login function if available
        login({
          id: 'admin_' + Date.now(), // Mock admin ID
          name: 'Admin User', // Mock admin name
          email: data.email,
          // Add admin-specific roles or flags here if needed
        });
        toast({
          title: 'Admin Login Successful',
          description: 'Welcome, Admin!',
        });
        // Redirect to an admin dashboard or a specific admin area
        router.push('/admin/dashboard'); // TODO: Create admin dashboard page
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Admin Login Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter your admin credentials below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@pasal.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Admin Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
               Not an admin?{' '}
               <Link href="/login" className="font-medium text-primary hover:underline">
                 Customer Login
               </Link>
             </p>
         </CardFooter>
      </Card>
    </div>
  );
}
