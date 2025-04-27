'use client';

import Link from 'next/link';
import { ShoppingCart, Search, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/hooks/use-cart';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const router = useRouter();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [searchTerm, setSearchTerm] = useState('');
  const addSearchTerm = useCartStore((state) => state.addSearchTerm);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addSearchTerm(searchTerm.trim());
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
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

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search products..."
              className="h-9 w-64 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" size="icon" variant="ghost" className="h-9 w-9 text-foreground hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>
          </form>
          <div className="flex items-center gap-2">
            <Link href="/cart">
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
             <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hidden md:inline-flex">
              <User className="h-5 w-5" />
              <span className="sr-only">User Profile</span>
            </Button>
             <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-secondary">
                    <nav className="flex flex-col gap-4 mt-8">
                      <form onSubmit={handleSearch} className="flex items-center gap-2 p-2">
                        <Input
                          type="search"
                          placeholder="Search products..."
                          className="h-9 flex-grow bg-background"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button type="submit" size="icon" variant="ghost" className="h-9 w-9 text-foreground hover:text-primary">
                          <Search className="h-5 w-5" />
                        </Button>
                      </form>
                       {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className="block px-2 py-1 text-lg font-medium text-foreground hover:text-primary transition-colors">
                          {item.label}
                        </Link>
                      ))}
                       <Link href="/profile" className="block px-2 py-1 text-lg font-medium text-foreground hover:text-primary transition-colors">
                        Profile
                      </Link>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
          </div>
        </div>
      </div>
    </header>
  );
}
