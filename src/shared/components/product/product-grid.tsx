import { memo } from "react";
import { ProductCard } from "./product-card";
import { Product } from "@/shared/types/products";

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid = memo(function ProductGrid({
  products,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      role="grid"
      aria-label="Products grid"
    >
      {products.map((product) => (
        <div key={product.id} role="gridcell">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
});
