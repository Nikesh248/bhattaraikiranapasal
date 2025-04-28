
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { KeyRound, ArrowLeft } from 'lucide-react'; // Icon for reset

// Schema for the reset password form including OTP
const resetPasswordSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits.' }), // Assuming 6-digit OTP
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;


export default function ResetPasswordPage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const identifier = searchParams.get('identifier'); // Get identifier (email/phone) from query params
   const { toast } = useToast();
   const [isLoading, setIsLoading] = useState(false);

   const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

   // Handle case where identifier is missing
   if (!identifier) {
     // Optionally redirect or show an error message
     // For now, just show a message within the card
     console.error("Identifier missing from URL for password reset.");
   }

   const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    if (!identifier) {
       toast({ variant: "destructive", title: "Error", description: "Missing identifier. Cannot reset password." });
       setIsLoading(false);
       return;
    }

    try {
       // Simulate API call to backend to verify OTP and reset password
       console.log('Submitting OTP and new password for:', identifier);
       console.log('OTP:', data.otp);
       // Replace with actual API call:
       // const response = await fetch('/api/reset-password', {
       //   method: 'POST',
       //   headers: { 'Content-Type': 'application/json' },
       //   body: JSON.stringify({ identifier, otp: data.otp, newPassword: data.newPassword }),
       // });
       // if (!response.ok) {
       //   const errorData = await response.json();
       //   throw new Error(errorData.message || 'Failed to reset password');
       // }
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay


       toast({
         title: 'Password Reset Successful',
         description: 'Your password has been updated. You can now log in.',
       });
       router.push('/login'); // Redirect to login page

    } catch (error) {
       console.error('Reset password error:', error);
       toast({
         variant: 'destructive',
         title: 'Password Reset Failed',
         description: error instanceof Error ? error.message : 'Invalid OTP or an error occurred.',
       });
    } finally {
       setIsLoading(false);
    }
   };


  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
           <div className="flex justify-center mb-4">
             <KeyRound className="h-12 w-12 text-primary" />
           </div>
          <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
          <CardDescription>
            Enter the OTP sent to {identifier ? `"${identifier}"` : 'your contact'} and set a new password.
          </CardDescription>
           {!identifier && (
              <p className="text-sm text-destructive">Error: Identifier not found in URL.</p>
            )}
        </CardHeader>
        <CardContent>
           {identifier ? (
             <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField
                   control={form.control}
                   name="otp"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>OTP Code</FormLabel>
                       <FormControl>
                         <Input type="text" placeholder="Enter 6-digit OTP" {...field} disabled={isLoading || !identifier} maxLength={6} />
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
                         <Input type="password" placeholder="******" {...field} disabled={isLoading || !identifier} />
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
                         <Input type="password" placeholder="******" {...field} disabled={isLoading || !identifier} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading || !identifier}>
                   {isLoading ? 'Resetting...' : 'Reset Password'}
                 </Button>
               </form>
             </Form>
            ) : (
               <p className="text-center text-destructive p-4 border border-destructive rounded-md">
                  Cannot proceed without an email or phone number identifier in the URL. Please request a password reset again.
               </p>
             )}
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
