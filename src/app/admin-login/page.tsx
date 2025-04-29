
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
// Note: We use the user auth store for simplicity in this mock.
import { useAuthStore } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const adminLoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore(); // Using user login for mock purposes
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // --- MOCK ADMIN AUTHENTICATION ---
      // This is a mock login. It only accepts specific hardcoded credentials.
      // The admin signup page simulates account creation but doesn't store
      // credentials in a way this login page can verify them.
      // Use these specific credentials to log in:
      const hardcodedAdminEmail = 'admin@pasal.com';
      const hardcodedAdminPassword = 'admin123';

      if (data.email === hardcodedAdminEmail && data.password === hardcodedAdminPassword) {
        // Log in using the user store for this mock
        login({
          id: 'admin_mock_' + Date.now(), // Mock admin ID
          name: 'Admin User', // Mock admin name
          email: data.email,
          // Add admin-specific roles or flags here if needed (e.g., isAdmin: true)
        });
        toast({
          title: 'Admin Login Successful',
          description: 'Welcome, Admin! Redirecting to dashboard...',
        });
        // Redirect to the admin dashboard
        router.push('/admin/dashboard'); // Ensure this page exists
      } else {
        // Throw a specific error if credentials don't match the hardcoded ones
        throw new Error('Invalid credentials. Please use admin@pasal.com / admin123 for mock login.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Admin Login Failed',
        // Display the specific error message from the catch block
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
       // Ensure loading state is turned off on error
       setIsLoading(false);
    }
    // No need to set isLoading=false on success because we redirect
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter your admin credentials below</CardDescription>
           {/* Add a prominent note about mock credentials */}
           <p className="text-sm font-semibold text-primary pt-2">(Use admin@pasal.com / admin123 for mock login)</p>
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
                    <div className="flex justify-between items-center">
                       <FormLabel>Password</FormLabel>
                       {/* Link to Admin Forgot Password */}
                       <Link href="/admin-forgot-password" className="text-sm text-primary hover:underline">
                         Forgot password?
                       </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="admin123" {...field} disabled={isLoading} />
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
               Need an admin account?{' '}
               <Link href="/admin-signup" className="font-medium text-primary hover:underline">
                 Admin Sign Up
               </Link>
             </p>
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
