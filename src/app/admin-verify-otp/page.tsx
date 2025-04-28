
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { useToast } from '@/hooks/use-toast';
import { KeyRound, ArrowLeft } from 'lucide-react'; // Import icons

const adminVerifyOtpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits.' }).regex(/^\d+$/, {message: "OTP must only contain digits."}),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // path of error
});

type AdminVerifyOtpFormValues = z.infer<typeof adminVerifyOtpSchema>;

function AdminVerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier'); // Get email/phone from query param
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If identifier is missing, redirect back to admin forgot password
    if (!identifier) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Admin identifier (email/phone) not found. Please start again.',
      });
      router.push('/admin-forgot-password');
    }
  }, [identifier, router, toast]);

  const form = useForm<AdminVerifyOtpFormValues>({
    resolver: zodResolver(adminVerifyOtpSchema),
    defaultValues: {
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: AdminVerifyOtpFormValues) => {
    setIsLoading(true);
    if (!identifier) {
        toast({ variant: "destructive", title: "Error", description: "Admin identifier missing." });
        setIsLoading(false);
        return;
    }

    try {
      // Simulate backend interaction to verify admin OTP and reset password
      console.log('Verifying admin OTP and resetting password for:', identifier);
      console.log('OTP:', data.otp);
      // IMPORTANT: Never log passwords in a real app

      // TODO: Replace with actual API call to /api/admin/verify-otp-and-reset endpoint
      await new Promise((resolve, reject) => {
          setTimeout(() => {
              // Simulate success/failure (e.g., based on OTP value)
              if (data.otp === '654321') { // Mock success OTP for admin
                 resolve(true);
              } else {
                 reject(new Error('Invalid or expired admin OTP.'));
              }
          }, 1500); // Simulate network delay
        });


      // Assume OTP verification and password reset were successful
      toast({
        title: 'Admin Password Reset Successful',
        description: 'Admin password has been updated. Please log in with the new password.',
      });

      // Redirect to the admin login page
      router.push('/admin-login');

    } catch (error) {
      console.error('Admin Verify OTP / Reset Password error:', error);
      toast({
        variant: 'destructive',
        title: 'Admin Reset Failed',
        description: error instanceof Error ? error.message : 'Could not reset admin password. Please try again or request a new OTP.',
      });
       setIsLoading(false); // Keep loading false on error
    }
     // No need to set isLoading to false here if redirecting on success
  };

  if (!identifier) {
    // Optional: Show a loading state or message while redirecting
    return <div className="flex justify-center items-center min-h-screen">Redirecting...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
           <div className="flex justify-center mb-2">
             <KeyRound className="h-10 w-10 text-primary" />
           </div>
          <CardTitle className="text-2xl font-bold">Verify Admin OTP & Reset Password</CardTitle>
          <CardDescription>
            Enter the OTP sent to the admin contact <span className="font-medium">{identifier}</span> and set a new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password (OTP)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit OTP"
                        {...field}
                        disabled={isLoading}
                        maxLength={6}
                        inputMode="numeric" // Hint for numeric keyboard on mobile
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
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
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? 'Verifying & Resetting...' : 'Reset Admin Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex justify-center">
          <Button variant="link" asChild className="text-sm text-muted-foreground">
            <Link href="/admin-login">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Admin Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


// Wrap the component with Suspense for useSearchParams
export default function AdminVerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <AdminVerifyOtpContent />
    </Suspense>
  );
}

