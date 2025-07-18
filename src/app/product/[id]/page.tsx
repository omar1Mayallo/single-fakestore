"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/shared/hooks/use-products";
import { useCart } from "@/shared/context/cart-context";
import { useToast } from "@/shared/components/ui/toast";
import { Header } from "@/shared/components/layout/header";
import { LoadingSpinner } from "@/shared/components/ui/loading-spinner";
import { ErrorMessage } from "@/shared/components/ui/error-message";

export default function ProductPage() {
  const params = useParams(); // Use useParams to get params
  const idNumber = Number(params.id); // Access id directly
  const { product, loading, error } = useProduct(idNumber);
  const { addToCart, cart } = useCart();
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);

  const cartItem = cart.items.find((item) => item.id === product?.id);

  const handleAddToCart = useCallback(() => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      addToast({
        title: "Added to cart",
        description: `${quantity} ${
          quantity === 1 ? "item" : "items"
        } added to your cart`,
        variant: "success",
        duration: 3000,
      });
      setQuantity(1);
    }
  }, [product, quantity, addToCart, addToast]);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    setQuantity(Math.max(1, Math.min(99, newQuantity)));
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        addToast({
          title: "Link copied",
          description: "Product link copied to clipboard",
          variant: "success",
        });
      }
    } else if (product) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        title: "Link copied",
        description: "Product link copied to clipboard",
        variant: "success",
      });
    }
  }, [product, addToast]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <ErrorMessage message={error || "Product not found"} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to Products
          </Link>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingSpinner size="md" />
                </div>
              )}
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8"
                crossOrigin="anonymous"
                priority
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3 capitalize">
                {product.category}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div
                  className="flex items-center gap-1"
                  role="img"
                  aria-label={`Rating: ${product.rating.rate} out of 5 stars`}
                >
                  <Star
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    aria-hidden="true"
                  />
                  <span className="font-medium">{product.rating.rate}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-muted-foreground">
                  {product.rating.count}{" "}
                  {product.rating.count === 1 ? "review" : "reviews"}
                </span>
              </div>

              <p className="text-4xl font-bold text-primary mb-6">
                {formatPrice(product.price)}
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-3 text-lg">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            {/* Add to Cart Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="font-medium">
                  Quantity:
                </label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max="99"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(Number.parseInt(e.target.value) || 1)
                    }
                    className="w-16 text-center border-0 focus:outline-none focus:ring-0"
                    aria-label="Product quantity"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 99}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 transition-all duration-200 hover:scale-105 focus:scale-105"
                  aria-label={`Add ${quantity} ${
                    quantity === 1 ? "item" : "items"
                  } to cart for ${formatPrice(product.price * quantity)}`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" aria-hidden="true" />
                  Add to Cart - {formatPrice(product.price * quantity)}
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    aria-label="Share this product"
                  >
                    <Share2 className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Share</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Add to wishlist</span>
                  </Button>
                </div>
              </div>

              {cartItem && (
                <div
                  className="text-sm text-muted-foreground text-center p-3 bg-muted/50 rounded-md"
                  role="status"
                  aria-live="polite"
                >
                  {cartItem.quantity}{" "}
                  {cartItem.quantity === 1 ? "item" : "items"} already in cart
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
