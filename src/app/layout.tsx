import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/shared/components/ui/toast";
import { CartProvider } from "@/shared/context/cart-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FakeStore - Premium E-commerce Experience",
  description:
    "Discover amazing products with our modern, accessible e-commerce platform built with Next.js and the Fake Store API",
  keywords: "ecommerce, shopping, products, online store, fake store api",
  authors: [{ name: "FakeStore Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "FakeStore - Premium E-commerce Experience",
    description:
      "Discover amazing products with our modern, accessible e-commerce platform",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <CartProvider>
            <div className="min-h-screen bg-background mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
              {children}
            </div>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
