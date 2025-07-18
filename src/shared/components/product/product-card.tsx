"use client";

import type React from "react";
import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/shared/types/products";
import { useCart } from "@/shared/context/cart-context";
import { useToast } from "../ui/toast";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    addToast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
      variant: "success",
      duration: 2000,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatRating = (rate: number) => {
    return rate.toFixed(1);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
      <Link
        href={`/product/${product.id}`}
        className="block focus:outline-none"
        aria-label={`View details for ${product.title}`}
      >
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-200 group-hover:scale-105"
            crossOrigin="anonymous"
            loading="lazy"
          />
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs capitalize">
              {product.category}
            </Badge>
          </div>
          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.title.length > 25
              ? product.title.slice(0, 25) + "..."
              : product.title}
          </h3>
          <div
            className="flex items-center gap-1 mb-2"
            role="img"
            aria-label={`Rating: ${formatRating(
              product.rating.rate
            )} out of 5 stars, ${product.rating.count} reviews`}
          >
            <Star
              className="h-4 w-4 fill-yellow-400 text-yellow-400"
              aria-hidden="true"
            />
            <span className="text-sm text-muted-foreground">
              {formatRating(product.rating.rate)} ({product.rating.count})
            </span>
          </div>
          <p
            className="text-lg font-bold text-primary"
            aria-label={`Price: ${formatPrice(product.price)}`}
          >
            {formatPrice(product.price)}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full transition-all duration-200 hover:scale-105 focus:scale-105"
          size="sm"
          aria-label={`Add ${product.title} to cart`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
});
