"use client";

import type React from "react";

import Link from "next/link";
import { ShoppingCart, Store, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/shared/context/cart-context";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearch, searchQuery = "" }: HeaderProps) {
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchValue);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    // Debounced search for better performance
    const timeoutId = setTimeout(() => {
      onSearch?.(e.target.value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
            aria-label="FakeStore - Go to homepage"
          >
            <Store className="h-6 w-6" aria-hidden="true" />
            <span className="text-xl font-bold">FakeStore</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchValue}
                onChange={handleSearchChange}
                className="pl-10 w-full"
                aria-label="Search products"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
              aria-label={`Shopping cart with ${cart.itemCount} items`}
            >
              <Button
                variant="outline"
                size="sm"
                className="relative bg-transparent"
              >
                <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
                <span className="sr-only md:not-sr-only">Cart</span>
                {cart.itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    aria-label={`${cart.itemCount} items in cart`}
                  >
                    {cart.itemCount > 99 ? "99+" : cart.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={cn(
            "md:hidden border-t transition-all duration-200 ease-in-out",
            isMobileMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          )}
        >
          <div className="py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchValue}
                onChange={handleSearchChange}
                className="pl-10 w-full"
                aria-label="Search products"
              />
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/cart"
                className="flex items-center text-sm font-medium hover:text-primary transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label={`Shopping cart with ${cart.itemCount} items`}
              >
                <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
                Cart ({cart.itemCount})
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
