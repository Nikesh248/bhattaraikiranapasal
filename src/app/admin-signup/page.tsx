
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
import { useAuthStore } from '@/hooks/use-auth'; // Consider a separate admin auth hook/store
import { useToast } from '@/hooks/use-toast';

// Hardcoded secret key - **IN A REAL APP, USE AN ENVIRONMENT VARIABLE**
const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || "PASAL_SECRET_KEY"; // Use env variable or fallback

// Add adminSecretKey field to the schema
const adminSignupSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
  adminSecretKey: z.string().min(1, { message: 'Admin secret key is required.' }), // Add secret key field
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // path of error
});

type AdminSignupFormValues = z.infer<typeof adminSignupSchema>;

export default function AdminSignupPage() {
  const router = useRouter();
  // Replace with admin-specific signup logic if needed
  const { signup } = useAuthStore(); // Using user signup for now
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AdminSignupFormValues>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      adminSecretKey: '', // Default for secret key
    },
  });

  const onSubmit = async (data: AdminSignupFormValues) => {
    setIsLoading(true);
    try {
      // --- SECRET KEY VALIDATION ---
      if (data.adminSecretKey !== ADMIN_SECRET_KEY) {
        throw new Error('Invalid Admin Secret Key.');
      }

      // Simulate API call for admin signup
      console.log('Admin Signup Data (Validated):', { ...data, adminSecretKey: '***REDACTED***' }); // Log data for debugging, hide key
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock: Assume signup is successful if fields are filled and key is valid
      signup({ // This should ideally be an admin-specific signup/login function
        id: 'admin_' + Date.now(), // Mock admin ID
        name: data.fullName,
        email: data.email,
        // Add admin roles/flags here
      });
      toast({
        title: 'Admin Signup Successful',
        description: 'Your admin account has been created.',
      });
      // Redirect to admin dashboard or login page
      router.push('/admin-login'); // Redirect to admin login after signup
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Admin Signup Failed',
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
          <CardTitle className="text-2xl font-bold">Create Admin Account</CardTitle>
          <CardDescription>Enter details and the secret key to create an admin account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Admin Full Name" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} disabled={isLoading} />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add Admin Secret Key field */}
              <FormField
                control={form.control}
                name="adminSecretKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Secret Key</FormLabel>
                    <FormControl>
                      {/* Use password type to obscure the key */}
                      <Input type="password" placeholder="Enter the secret key" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Admin Account'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
           <p className="text-sm text-muted-foreground">
              Already have an admin account?{' '}
              <Link href="/admin-login" className="font-medium text-primary hover:underline">
                Admin Login
              </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
