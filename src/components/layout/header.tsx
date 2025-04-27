
'use client';

import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/hooks/use-cart';
import { useAuthStore } from '@/hooks/use-auth';
import { useState } from 'react';
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


export default function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const addSearchTerm = useCartStore((state) => state.addSearchTerm);
  const { user, isAuthenticated, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { href: '/category/Groceries', label: 'Groceries' },
    { href: '/category/Electronics', label: 'Electronics' },
    { href: '/category/Fashion', label: 'Fashion' },
    { href: '/category/Home', label: 'Home' },
  ];

  return (
    <header className="bg-secondary sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Side: Logo and Desktop Nav */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            PasalPal
          </Link>
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
          <Link href="/cart" aria-label={`Shopping Cart with ${totalItems} items`}>
            <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </Link>

          {/* Auth Dropdown / Login Button (Desktop) */}
          <div className="hidden md:flex">
             {isAuthenticated && user ? (
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
               <Link href="/login">
                 <Button variant="ghost" className="text-foreground hover:text-primary">
                   <LogIn className="mr-2 h-4 w-4" /> Login
                 </Button>
               </Link>
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

                 {/* Mobile Auth Section */}
                  <div className="mt-auto pt-4 border-t border-border">
                   {isAuthenticated && user ? (
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
                   )}
                 </div>

              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
