
'use client';

import { useState, useEffect, Suspense } from 'react'; // Import Suspense
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
import { Label } from '@/components/ui/label'; // Label is used via FormLabel
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

const verifyOtpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits.' }).regex(/^\d+$/, {message: "OTP must only contain digits."}),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // path of error
});

type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

// Inner component that uses useSearchParams
function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier'); // Get email/phone from query param
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If identifier is missing, redirect back to forgot password
    if (!identifier) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Identifier (email/phone) not found. Please start again.',
      });
      router.push('/forgot-password');
    }
  }, [identifier, router, toast]);

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: VerifyOtpFormValues) => {
    setIsLoading(true);
    if (!identifier) {
        toast({ variant: "destructive", title: "Error", description: "Identifier missing." });
        setIsLoading(false);
        return;
    }

    try {
      // Simulate backend interaction to verify OTP and reset password
      console.log('Verifying OTP and resetting password for:', identifier);
      console.log('OTP:', data.otp);
      // IMPORTANT: Never log passwords in a real app
      // console.log('New Password:', data.newPassword);

      // TODO: Replace with actual API call to /verify-otp-and-reset endpoint
      await new Promise((resolve, reject) => {
          setTimeout(() => {
              // Simulate success/failure (e.g., based on OTP value)
              if (data.otp === '245678') { // Updated mock success OTP
                 resolve(true);
              } else {
                 reject(new Error('Invalid or expired OTP.'));
              }
          }, 1500); // Simulate network delay
        });


      // Assume OTP verification and password reset were successful
      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been updated. Please log in with your new password.',
      });

      // Redirect to the login page
      router.push('/login');

    } catch (error) {
      console.error('Verify OTP / Reset Password error:', error);
      toast({
        variant: 'destructive',
        title: 'Reset Failed',
        description: error instanceof Error ? error.message : 'Could not reset password. Please try again or request a new OTP.',
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
          <CardTitle className="text-2xl font-bold">Verify OTP & Reset Password</CardTitle>
          <CardDescription>
            Enter the OTP sent to <span className="font-medium">{identifier}</span> and your new password.
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
                {isLoading ? 'Verifying & Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex justify-center">
          <Button variant="link" asChild className="text-sm text-muted-foreground">
            <Link href="/login">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


// Wrap the component with Suspense
export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
