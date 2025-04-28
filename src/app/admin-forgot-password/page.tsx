
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
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

// Update schema to accept a non-empty string for email or phone
const adminForgotPasswordSchema = z.object({
   identifier: z.string().min(1, { message: 'Please enter your admin email or phone number.' }),
});

type AdminForgotPasswordFormValues = z.infer<typeof adminForgotPasswordSchema>;

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // State to show success message

  const form = useForm<AdminForgotPasswordFormValues>({
    resolver: zodResolver(adminForgotPasswordSchema),
    defaultValues: {
       identifier: '',
    },
  });

  const onSubmit = async (data: AdminForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call to backend to initiate admin password reset OTP
      console.log('Admin password reset OTP requested for:', data.identifier);
      // Replace with actual API call to /send-otp or similar endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      // In a real app, the backend would send an OTP to the admin's registered contact.
      toast({
        title: 'Admin Password Reset OTP Sent',
        description: 'If an admin account exists for this identifier, you will receive an OTP shortly.',
      });
      setIsSubmitted(true); // Show success message instead of form

    } catch (error) {
      console.error('Admin forgot password error:', error);
      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description: 'Could not process your request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Admin Forgot Password</CardTitle>
           {!isSubmitted && (
             <CardDescription>
                Enter your admin email or phone number to receive an OTP.
             </CardDescription>
            )}
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
              <div className="text-center space-y-4">
                 <p className="text-muted-foreground">
                    An OTP has been sent to the admin contact information. Please check messages/email.
                    {/* TODO: Add form for OTP and new password */}
                 </p>
                 <Button onClick={() => router.push('/admin-login')} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Back to Admin Login
                 </Button>
              </div>
            ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="identifier" // Changed name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email or Phone Number</FormLabel> {/* Updated Label */}
                      <FormControl>
                        <Input placeholder="admin@example.com or 98XXXXXXXX" {...field} disabled={isLoading} /> {/* Updated placeholder */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP'} {/* Updated button text */}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
         {!isSubmitted && ( // Only show footer if form is visible
             <CardFooter className="flex justify-center">
                 <Button variant="link" asChild className="text-sm text-muted-foreground">
                     <Link href="/admin-login">
                        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Admin Login
                     </Link>
                 </Button>
             </CardFooter>
            )}
      </Card>
    </div>
  );
}
