
'use client';

import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, LogIn, LogOut, History, PackagePlus, ChevronDown } from 'lucide-react'; // Added ChevronDown
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
  DropdownMenuSub, // Import Sub components
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories } from '@/lib/data'; // Import function to get categories

export default function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  // Get cart state after client-side mount
  const totalItems = useCartStore((state) => (isClient ? state.getTotalItems() : 0));
  const addSearchTerm = useCartStore((state) => state.addSearchTerm);


  useEffect(() => {
    setIsClient(true);
    // Fetch categories on client mount
    const fetchCategories = async () => {
      // getCategories might need to become async if data fetching changes
      const fetchedCategories = await getCategories(); // Assuming getCategories can be async now
      setCategories(fetchedCategories);
    };
    fetchCategories();
  }, []);

  // Simple mock admin check - replace with real logic if needed
  const isAdmin = user?.email === 'admin@pasal.com';


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

  const baseNavItems = [
    { href: '/', label: 'Home' },
    // Add Order History conditionally later
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
               {baseNavItems.map((item) => (
                 <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                   {item.label}
                 </Link>
               ))}
               {/* Categories Dropdown */}
                {isClient && categories.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-2">
                        Categories <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {categories.map((category) => (
                        <DropdownMenuItem key={category} asChild>
                          <Link href={`/category/${encodeURIComponent(category)}`}>
                            {category}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {/* Conditionally render Order History for authenticated users */}
                {isClient && isAuthenticated && (
                   <Link href="/profile/orders" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                     <History className="h-4 w-4" /> Order History
                   </Link>
                )}
                 {/* Conditionally render Add Item for admin users */}
                {isClient && isAuthenticated && isAdmin && (
                   <Link href="/admin/add-item" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                     <PackagePlus className="h-4 w-4" /> Add Item
                   </Link>
                )}
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
                   <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-[1rem] flex items-center justify-center rounded-full p-0.5 text-xs font-medium">
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
              <div className="hidden md:flex items-center justify-center min-w-[6rem]">
               {/* Render skeleton initially */}
               {!isClient ? (
                 <Skeleton className="h-8 w-20 rounded-md" />
               ) : isAuthenticated && user ? (
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                         <Avatar className="h-8 w-8">
                           <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name || ''} />
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
                       <DropdownMenuItem asChild>
                         <Link href="/profile/orders">
                           <History className="mr-2 h-4 w-4" />
                           <span>Order History</span>
                         </Link>
                       </DropdownMenuItem>
                       {/* Admin-only item */}
                       {isAdmin && (
                         <DropdownMenuItem asChild>
                           <Link href="/admin/add-item">
                             <PackagePlus className="mr-2 h-4 w-4" />
                             <span>Add Item</span>
                           </Link>
                         </DropdownMenuItem>
                        )}
                       <DropdownMenuSeparator />
                       <DropdownMenuItem onClick={handleLogout}>
                         <LogOut className="mr-2 h-4 w-4" />
                         <span>Log out</span>
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 ) : (
                   <Link href="/login" passHref legacyBehavior>
                     <Button as="a" variant="ghost" className="text-foreground hover:text-primary text-sm px-3">
                       <LogIn className="mr-1 h-4 w-4" /> Login
                     </Button>
                   </Link>
                 )
               }
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
                     {baseNavItems.map((item) => (
                       <Link
                         key={item.href}
                         href={item.href}
                         className="block px-2 py-2 text-lg font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                         onClick={() => setIsMobileMenuOpen(false)}
                       >
                         {item.label}
                       </Link>
                     ))}
                     {/* Mobile Categories */}
                      {isClient && categories.length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="w-full justify-start px-2 py-2 text-lg font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10">
                                Categories <ChevronDown className="ml-auto h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            {/* Use Portal to ensure content renders correctly in Sheet */}
                            <DropdownMenuPortal>
                                <DropdownMenuContent
                                    side="bottom" // Adjust side as needed within the sheet
                                    align="start"
                                    className="w-[calc(100%-2rem)] ml-4 bg-background border-border shadow-lg" // Style appropriately for mobile dropdown
                                >
                                    {categories.map((category) => (
                                    <DropdownMenuItem key={category} asChild>
                                        <Link
                                            href={`/category/${encodeURIComponent(category)}`}
                                            onClick={() => setIsMobileMenuOpen(false)} // Close sheet on selection
                                        >
                                        {category}
                                        </Link>
                                    </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenuPortal>
                          </DropdownMenu>
                        )}
                      {/* Conditionally render Order History for authenticated users */}
                      {isClient && isAuthenticated && (
                         <Link
                           href="/profile/orders"
                           className="flex items-center gap-2 px-2 py-2 text-lg font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           <History className="h-5 w-5" /> Order History
                         </Link>
                      )}
                      {/* Conditionally render Add Item for admin users */}
                      {isClient && isAuthenticated && isAdmin && (
                         <Link
                           href="/admin/add-item"
                           className="flex items-center gap-2 px-2 py-2 text-lg font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           <PackagePlus className="h-5 w-5" /> Add Item
                         </Link>
                      )}
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
