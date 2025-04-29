
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
import { useAuthStore } from '@/hooks/use-auth'; // Uses user store for simplicity
import { useToast } from '@/hooks/use-toast';

// Use environment variable or fallback to hardcoded secret key
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "seller@seller";

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
  // Using user signup for mock purposes. This does NOT create persistent admin credentials.
  const { signup } = useAuthStore();
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

      // --- MOCK ADMIN SIGNUP ---
      // This simulates admin signup but DOES NOT create actual login credentials
      // that can be used on the admin login page (unless they match the hardcoded ones).
      // The login page uses fixed credentials: admin@pasal.com / admin123
      console.log('Simulating Admin Signup (Data not persistently stored for login):', {
         fullName: data.fullName,
         email: data.email,
         adminSecretKey: '***REDACTED***'
      });
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      // Mock: Call the user signup function (doesn't store password for login)
      signup({
        id: 'admin_mock_' + Date.now(),
        name: data.fullName,
        email: data.email,
        // In a real app, add admin roles/flags here
      });

      toast({
        title: 'Admin Signup Simulated',
        description: 'Mock admin account process complete. Please use the hardcoded credentials to log in.',
      });

      // Redirect to admin login page after simulated signup
      router.push('/admin-login');
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
          <CardTitle className="text-2xl font-bold">Create Admin Account (Mock)</CardTitle>
          <CardDescription>Enter details and the secret key to simulate admin signup.</CardDescription>
           <p className="text-xs text-muted-foreground pt-1">(Secret Key: seller@seller)</p>
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
                {isLoading ? 'Simulating...' : 'Simulate Admin Signup'}
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
