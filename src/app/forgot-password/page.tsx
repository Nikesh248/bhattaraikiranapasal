
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
// Removed unused import: import { sendPasswordResetRequestEmail } from '@/ai/flows/send-password-reset-request-email';

// Schema to accept email or phone number
const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, { message: 'Please enter your email or phone number.' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // Removed isSubmitted state as we now redirect

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // Simulate backend interaction to send OTP
      console.log('OTP requested for identifier:', data.identifier);

      // TODO: Replace with actual API call to /send-otp endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // Assume OTP sending was successful
      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to ${data.identifier}. Please check your messages/email.`,
      });

      // Redirect to the OTP verification page, passing the identifier
      router.push(`/verify-otp?identifier=${encodeURIComponent(data.identifier)}`);

    } catch (error) {
      console.error('Forgot password error:', error);
      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description: 'Could not send OTP. Please try again.',
      });
      setIsLoading(false); // Keep loading false on error
    }
    // No need to set isLoading to false here if redirecting on success
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email or phone number to receive an OTP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Phone Number</FormLabel>
                    <FormControl>
                      {/* Changed placeholder */}
                      <Input placeholder="you@example.com or 98XXXXXXXX" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
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
