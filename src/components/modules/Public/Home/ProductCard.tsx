"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ProductQuickViewModal from "./ProductQuickViewModal";

export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  productCategory: {
    category: {
      name: string;
      slug: string;
      id: string;
    };
  }[];
  newArrival?: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  const image = product.images?.[0] ?? "/placeholder.png";

  return (
    <Card className="rounded-xl overflow-hidden border shadow-sm">
      <div className="relative">
        {/* NEW ARRIVAL BADGE */}
        {product.newArrival && (
          <Badge className="absolute top-3 left-3 bg-red-600 text-white text-xs">
            New
          </Badge>
        )}

        <Image
          src={image}
          width={500}
          height={500}
          alt={product.title}
          className="w-full h-60 object-cover"
        />
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="text-sm font-semibold">{product.title}</h3>

        <span className="text-lg font-bold">৳ {product.price}</span>

        <div className="flex gap-2">
          <Button
            onClick={() => setOpen(true)}
            className="flex-1 bg-black text-white"
          >
            Order
          </Button>
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="flex-1"
          >
            Add To Cart
          </Button>
        </div>
        
      </CardContent>
      <ProductQuickViewModal
          open={open}
          setOpen={setOpen}
          product={product}
        />
    </Card>
  );
}
