
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

const adminForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid admin email address.' }),
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
      email: '',
    },
  });

  const onSubmit = async (data: AdminForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call to backend to initiate admin password reset
      console.log('Admin password reset requested for:', data.email);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      // In a real app, the backend would send an email with a reset link/code.
      // Here, we just show a success message.
      toast({
        title: 'Admin Password Reset Email Sent',
        description: 'If an admin account exists for this email, you will receive instructions to reset your password shortly.',
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
                Enter your admin email address and we'll send you instructions to reset your password.
             </CardDescription>
            )}
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
              <div className="text-center space-y-4">
                 <p className="text-muted-foreground">
                    Password reset instructions have been sent to the admin email address. Please check the inbox (and spam folder).
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} disabled={isLoading} />
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
