'use client'; // Add this directive

import { useEffect, useState, lazy, Suspense } from 'react'; // Import useEffect, useState, lazy and Suspense
// Removed Metadata import as it's not used directly in client component root layout
// import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
// import Header from '@/components/layout/header';
// import Footer from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load Header and Footer components
const Header = lazy(() => import('@/components/layout/header'));
const Footer = lazy(() => import('@/components/layout/footer'));

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Add display swap for better font rendering
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap', // Add display swap for better font rendering
});

// Metadata is typically defined in Server Components or generateMetadata.
// Since this is now a client component, the static export is removed.
// export const metadata: Metadata = {
//   title: 'Bhattarai Kirana Pasal - Your Local Shop',
//   description: 'Shop groceries, essentials, and more!',
// };

// Removed auto-refresh interval
// const REFRESH_INTERVAL_MS = 2 * 60 * 1000;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Removed the useEffect that caused the page to reload every 2 minutes
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     console.log(`Auto-refreshing page now (interval: ${REFRESH_INTERVAL_MS / 1000}s)...`);
  //     window.location.reload();
  //   }, REFRESH_INTERVAL_MS);
  //   return () => {
  //     console.log('Clearing auto-refresh interval.');
  //     clearInterval(intervalId);
  //   };
  // }, []);

  return (
    <html lang="en">
      <head>
        {/* Manually set title and meta description for client component layout */}
        <title>Bhattarai Kirana Pasal - Your Local Shop</title>
        <meta name="description" content="Shop groceries, essentials, and more!" />
        {/* Add other necessary head elements like favicons here if needed */}
         {/* Preload fonts */}
         <link rel="preload" href={geistSans.path} as="font" type="font/woff2" crossOrigin="anonymous" />
         <link rel="preload" href={geistMono.path} as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <Suspense fallback={<Skeleton className="h-20 w-full bg-muted" />}>
          <Header />
        </Suspense>
        <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
        <Suspense fallback={<Skeleton className="h-16 w-full bg-muted" />}>
          <Footer />
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
