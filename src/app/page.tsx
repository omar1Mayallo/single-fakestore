"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Search, Filter, SortAsc } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Product } from "@/shared/types/products";
import { useCategories, useProducts } from "@/shared/hooks/use-products";
import { Header } from "@/shared/components/layout/header";
import { ProductGridSkeleton } from "@/shared/components/ui/product-skeleton";
import { ErrorMessage } from "@/shared/components/ui/error-message";
import { ProductGrid } from "@/shared/components/product/product-grid";

export default function HomePage() {
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Debounced search for better performance
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = useCallback((query: string) => {
    setSearchTerm(query);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (product: Product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product: Product) => product.category === selectedCategory
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "rating":
        return [...filtered].sort((a, b) => b.rating.rate - a.rating.rate);
      case "name":
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      case "popularity":
        return [...filtered].sort((a, b) => b.rating.count - a.rating.count);
      default:
        return filtered;
    }
  }, [products, debouncedSearchTerm, selectedCategory, sortBy]);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("default");
  }, []);

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={handleSearch} searchQuery={searchTerm} />
        <div className="container py-8">
          <div className="mb-8">
            <div className="h-8 bg-muted rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-muted rounded w-96 animate-pulse" />
          </div>
          <ProductGridSkeleton />
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={handleSearch} searchQuery={searchTerm} />
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <ErrorMessage message={productsError} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} searchQuery={searchTerm} />

      <main className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Our Products</h1>
          <p className="text-muted-foreground">
            Discover our amazing collection of products
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="lg:hidden"
                aria-expanded={isFiltersOpen}
                aria-controls="filters-section"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            </div>

            {/* Results count */}
            <p
              className="text-sm text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              Showing {filteredAndSortedProducts.length} of {products.length}{" "}
              products
              {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
            </p>
          </div>

          {/* Filter Controls */}
          <div
            id="filters-section"
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-200 ${
              isFiltersOpen || window.innerWidth >= 1024
                ? "block"
                : "hidden lg:grid"
            }`}
          >
            <div>
              <label
                htmlFor="category-select"
                className="block text-sm font-medium mb-2"
              >
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger
                  id="category-select"
                  aria-label="Filter by category"
                >
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {!categoriesLoading &&
                    categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="sort-select"
                className="block text-sm font-medium mb-2"
              >
                Sort by
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-select" aria-label="Sort products">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:hidden">
              <label
                htmlFor="mobile-search"
                className="block text-sm font-medium mb-2"
              >
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="mobile-search"
                  type="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Search products"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={filteredAndSortedProducts} />

        {/* No results message */}
        {filteredAndSortedProducts.length === 0 && !productsLoading && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={resetFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
