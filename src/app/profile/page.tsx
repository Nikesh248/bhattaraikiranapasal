
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, History, MapPin } from 'lucide-react'; // Added History and MapPin
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link'; // Import Link

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/login'); // Redirect to login after logout
  };

  // Show loading skeleton while checking authentication or loading user data
  if (!isAuthenticated || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md shadow-lg">
           <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
             <Skeleton className="h-12 w-12 rounded-full" />
             <div className="space-y-2">
               <Skeleton className="h-6 w-32" />
               <Skeleton className="h-4 w-48" />
             </div>
           </CardHeader>
           <CardContent className="space-y-4 mt-4">
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-10 w-full mt-6" /> {/* Skeleton for Logout button */}
           </CardContent>
         </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
          <Avatar className="h-12 w-12">
            {/* In real app use user.avatarUrl or similar */}
            <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
           {/* Link to Order History */}
          <Button asChild variant="outline" className="w-full justify-start text-left">
             <Link href="/profile/orders">
               <History className="mr-2 h-4 w-4" /> Order History
             </Link>
           </Button>
           {/* Placeholder for Saved Addresses */}
           <Button variant="outline" className="w-full justify-start text-left" disabled> {/* Disable for now */}
             <MapPin className="mr-2 h-4 w-4" /> Saved Addresses
           </Button>
          <Button variant="destructive" onClick={handleLogout} className="w-full flex items-center justify-center gap-2 mt-6">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
