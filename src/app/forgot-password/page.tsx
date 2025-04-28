
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
import { ArrowLeft } from 'lucide-react'; // Import icon
import { sendPasswordResetRequestEmail } from '@/ai/flows/send-password-reset-request-email'; // Import the new flow

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
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
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // Simulate backend interaction (or real interaction if implemented)
      console.log('Password reset requested for customer:', data.email);

      // Send notification email to admin using the Genkit flow
      const emailResult = await sendPasswordResetRequestEmail({
        customerEmail: data.email,
      });

      if (!emailResult.success) {
        // Log the error but still proceed with the user-facing confirmation
        console.error('Failed to send admin notification email:', emailResult.message);
      }

      // In a real app, the backend would ideally handle sending the *actual* reset email to the customer.
      // Here, we proceed as if the process was initiated successfully.

      toast({
        title: 'Password Reset Request Received',
        description: 'If an account exists for this email, instructions may be sent. Please contact support if you have issues.',
      });
      setIsSubmitted(true); // Show success message instead of form

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
                Enter your email address to request a password reset.
             </CardDescription>
            )}
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
              <div className="text-center space-y-4">
                 <p className="text-muted-foreground">
                    Your password reset request has been received. If your email is associated with an account, further instructions may follow. Please check your inbox (and spam folder) or contact support.
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
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
