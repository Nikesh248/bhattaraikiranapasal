
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
const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, { message: 'Please enter your email or phone number.' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // State to show success message

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // Simulate backend interaction: Call /send-otp endpoint
      console.log('Requesting OTP for identifier:', data.identifier);
      // Replace with actual API call
      // const response = await fetch('/api/send-otp', { // Example API endpoint
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ identifier: data.identifier }),
      // });
      // if (!response.ok) {
      //   throw new Error('Failed to send OTP');
      // }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      // Remove the call to sendPasswordResetRequestEmail

      toast({
        title: 'OTP Sent',
        description: 'If an account exists for this identifier, an OTP has been sent.',
      });
      setIsSubmitted(true); // Show success message

      // In a real app, you would likely redirect to an OTP verification page here
      // router.push(`/verify-otp?identifier=${encodeURIComponent(data.identifier)}`);

    } catch (error) {
      console.error('Forgot password error:', error);
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
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
           {!isSubmitted && (
             <CardDescription>
                Enter your email or phone number to receive an OTP.
             </CardDescription>
            )}
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
              <div className="text-center space-y-4">
                 <p className="text-muted-foreground">
                    An OTP has been sent to your registered email or phone number. Please check your messages.
                    {/* TODO: Add a form here to input OTP and new password */}
                 </p>
                 <Button onClick={() => router.push('/login')} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Back to Login
                 </Button>
              </div>
            ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="identifier" // Changed name from email to identifier
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email or Phone Number</FormLabel> {/* Updated Label */}
                      <FormControl>
                        <Input placeholder="you@example.com or 98XXXXXXXX" {...field} disabled={isLoading} /> {/* Updated placeholder */}
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
                     <Link href="/login">
                        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Login
                     </Link>
                 </Button>
             </CardFooter>
            )}
      </Card>
    </div>
  );
}
