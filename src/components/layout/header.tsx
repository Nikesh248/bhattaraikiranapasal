
'use client';

import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/hooks/use-cart';
import { useAuthStore } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from "@/components/ui/skeleton";


export default function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Get cart state after client-side mount
  const totalItems = useCartStore((state) => (isClient ? state.getTotalItems() : 0));
  const addSearchTerm = useCartStore((state) => state.addSearchTerm);


  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addSearchTerm(searchTerm.trim());
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Clear search after submitting
       if (isMobileMenuOpen) setIsMobileMenuOpen(false); // Close mobile menu on search
    }
  };

   const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/login'); // Redirect to login after logout
     if (isMobileMenuOpen) setIsMobileMenuOpen(false); // Close mobile menu
  };

  const getInitials = (name: string = '') => {
     if (!name) return '?';
     return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
   };

  const navItems = [
    { href: '/', label: 'Home' },
    // Removed category links as requested
  ];

  // Static aria-label for initial render consistency
  const cartLabel = 'Shopping Cart';
  // Dynamic aria-label for client-side after hydration
  const dynamicCartLabel = isClient && totalItems > 0 ? `Shopping Cart, ${totalItems} items` : cartLabel;


  return (
    <header className="bg-secondary sticky top-0 z-50 shadow-md py-3">
      <div className="container mx-auto px-4 flex flex-col items-center">
         {/* Brand Name Centered on Top */}
         <Link href="/" className="text-2xl font-bold text-primary mb-2 text-center">
           Bhattarai Kirana Pasal
         </Link>

         {/* Main Header Content Row */}
         <div className="w-full flex items-center justify-between">
           {/* Left Side: Desktop Nav */}
           <div className="flex items-center gap-4">
             <nav className="hidden md:flex items-center gap-4">
               {navItems.map((item) => (
                 <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                   {item.label}
                 </Link>
               ))}
             </nav>
           </div>

           {/* Right Side: Search, Cart, Auth, Mobile Menu */}
           <div className="flex items-center gap-2 md:gap-4">
             {/* Desktop Search */}
             <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
               <Input
                 type="search"
                 placeholder="Search products..."
                 className="h-9 w-48 lg:w-64 bg-background"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 aria-label="Search products"
               />
               <Button type="submit" size="icon" variant="ghost" className="h-9 w-9 text-foreground hover:text-primary">
                 <Search className="h-5 w-5" />
                 <span className="sr-only">Search</span>
               </Button>
             </form>

             {/* Cart */}
             <Link href="/cart" aria-label={cartLabel}>
               <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary">
                 <ShoppingCart className="h-5 w-5" />
                 {/* Only render the badge on the client when items exist */}
                 {isClient && totalItems > 0 && (
                   <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs">
                     {totalItems}
                   </Badge>
                 )}
                 {/* Static text for initial render */}
                 {!isClient && <span className="sr-only">{cartLabel}</span>}
                 {/* Dynamic text for screen readers after hydration */}
                 {isClient && <span className="sr-only">{dynamicCartLabel}</span>}
               </Button>
             </Link>

             {/* Auth Dropdown / Login Button (Desktop) */}
             <div className="hidden md:flex h-10 w-24 items-center justify-center">
               {isClient ? ( // Check if client is hydrated
                   isAuthenticated && user ? (
                     // Render DropdownMenu when client hydrated and user logged in
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                           <Avatar className="h-8 w-8">
                             <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                             <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                           </Avatar>
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent className="w-56" align="end" forceMount>
                         <DropdownMenuLabel className="font-normal">
                           <div className="flex flex-col space-y-1">
                             <p className="text-sm font-medium leading-none">{user.name}</p>
                             <p className="text-xs leading-none text-muted-foreground">
                               {user.email}
                             </p>
                           </div>
                         </DropdownMenuLabel>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem asChild>
                           <Link href="/profile">
                             <User className="mr-2 h-4 w-4" />
                             <span>Profile</span>
                           </Link>
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={handleLogout}>
                           <LogOut className="mr-2 h-4 w-4" />
                           <span>Log out</span>
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                   ) : (
                     // Render Login button when client hydrated and user logged out
                     <Link href="/login" passHref legacyBehavior>
                       <Button as="a" variant="ghost" className="text-foreground hover:text-primary text-sm">
                         <LogIn className="mr-1 h-4 w-4" /> Login
                       </Button>
                     </Link>
                   )
               ) : (
                 // Render skeleton initially on both server and client
                 <Skeleton className="h-8 w-20 rounded-md" />
               )}
             </div>


             {/* Mobile Menu */}
             <div className="md:hidden">
               <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                 <SheetTrigger asChild>
                   <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                     <Menu className="h-6 w-6" />
                     <span className="sr-only">Toggle menu</span>
                   </Button>
                 </SheetTrigger>
                 <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-secondary p-4 flex flex-col">
                   {/* Mobile Search */}
                   <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
                     <Input
                       type="search"
                       placeholder="Search products..."
                       className="h-9 flex-grow bg-background"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       aria-label="Search products"
                     />
                     <Button type="submit" size="icon" variant="ghost" className="h-9 w-9 text-foreground hover:text-primary">
                       <Search className="h-5 w-5" />
                       <span className="sr-only">Search</span>
                     </Button>
                   </form>

                   {/* Mobile Navigation */}
                   <nav className="flex-grow flex flex-col gap-2">
                     {navItems.map((item) => (
                       <Link
                         key={item.href}
                         href={item.href}
                         className="block px-2 py-2 text-lg font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                         onClick={() => setIsMobileMenuOpen(false)}
                       >
                         {item.label}
                       </Link>
                     ))}
                   </nav>

                   {/* Mobile Auth Section - Only render on client */}
                   <div className="mt-auto pt-4 border-t border-border">
                     {isClient ? ( // Check if client is hydrated
                       isAuthenticated && user ? (
                         <div className="space-y-2">
                           <Link
                             href="/profile"
                             className="flex items-center gap-2 px-2 py-2 text-lg font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                             onClick={() => setIsMobileMenuOpen(false)}
                           >
                             <User className="h-5 w-5" /> Profile
                           </Link>
                           <Button
                             variant="ghost"
                             onClick={handleLogout}
                             className="w-full justify-start px-2 py-2 text-lg font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
                           >
                             <LogOut className="mr-2 h-5 w-5" /> Logout
                           </Button>
                         </div>
                       ) : (
                         <Link
                           href="/login"
                           className="flex items-center gap-2 px-2 py-2 text-lg font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           <LogIn className="mr-2 h-5 w-5" /> Login
                         </Link>
                       )
                     ) : (
                       // Placeholder for mobile auth section while loading
                       <div className="flex items-center gap-2 px-2 py-2 text-lg font-medium text-muted-foreground">
                         <Skeleton className="h-6 w-6 rounded-full" />
                         <Skeleton className="h-5 w-20 rounded" />
                       </div>
                     )}
                   </div>

                 </SheetContent>
               </Sheet>
             </div>
           </div>
         </div>
       </div>
     </header>
   );
}

