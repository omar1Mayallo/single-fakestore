/* eslint-disable react/no-unescaped-entities */

"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/shared/types/products";
import { useToast } from "@/shared/components/ui/toast";
import { useCart } from "@/shared/context/cart-context";
import { Header } from "@/shared/components/layout/header";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addToast } = useToast();

  const handleRemoveItem = useCallback(
    (id: number, title: string) => {
      removeFromCart(id);
      addToast({
        title: "Item removed",
        description: `${title} has been removed from your cart`,
        variant: "success",
      });
    },
    [removeFromCart, addToast]
  );

  const handleClearCart = useCallback(() => {
    clearCart();
    addToast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
      variant: "success",
    });
  }, [clearCart, addToast]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const estimatedTax = cart.total * 0.08; // 8% tax rate
  const shipping = cart.total > 50 ? 0 : 9.99;
  const finalTotal = cart.total + estimatedTax + shipping;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center py-12 max-w-md mx-auto">
            <ShoppingBag
              className="h-16 w-16 mx-auto text-muted-foreground mb-4"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any products to your cart yet
            </p>
            <Link href="/">
              <Button
                size="lg"
                className="transition-all duration-200 hover:scale-105"
              >
                <ArrowRight className="h-4 w-4 mr-2" aria-hidden="true" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleClearCart}
            className="hover:bg-destructive hover:text-destructive-foreground transition-colors bg-transparent"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item: CartItem) => (
              <Card
                key={item.id}
                className="transition-all duration-200 hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain p-2"
                        crossOrigin="anonymous"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.id}`}
                        className="font-semibold hover:text-primary line-clamp-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1 capitalize">
                        {item.category}
                      </p>
                      <p className="font-bold text-primary mt-2">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id, item.title)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>

                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.title}`}
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <span
                          className="px-3 py-1 min-w-[2.5rem] text-center text-sm font-medium"
                          aria-label={`Quantity: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label={`Increase quantity of ${item.title}`}
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>

                      <p className="font-semibold text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.itemCount} items)</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span>{formatPrice(estimatedTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  {cart.total < 50 && shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add {formatPrice(50 - cart.total)} more for free shipping
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    className="w-full"
                    size="lg"
                    aria-label={`Proceed to checkout with total of ${formatPrice(
                      finalTotal
                    )}`}
                  >
                    Proceed to Checkout
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
