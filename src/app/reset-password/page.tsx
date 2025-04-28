
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound } from 'lucide-react'; // Icon for reset

export default function ResetPasswordPage() {
  // In a real app, this page would likely expect a token in the URL query parameters
  // e.g., /reset-password?token=abcdef12345
  // const searchParams = useSearchParams();
  // const token = searchParams.get('token');

  // Add state and form handling here for the new password fields

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
           <div className="flex justify-center mb-4">
             <KeyRound className="h-12 w-12 text-primary" />
           </div>
          <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password below.
            {/* Add message if token is invalid/missing */}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/*
            Placeholder for the actual reset password form:
            - New Password field
            - Confirm New Password field
            - Submit Button
            - Add form validation (use react-hook-form and zod)
            - Add submission logic to call backend API to update password with the token
          */}
          <p className="text-center text-muted-foreground p-4 border rounded-md">
            Password reset form will be implemented here.
          </p>
          <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
