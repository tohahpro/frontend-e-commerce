"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/formatters";
import { IProduct } from "@/types/product.interface";
import Image from "next/image";
import {
  Calendar,
  Tag,
  Package,
  Layers,
  DollarSign,
  Barcode,
  Boxes,
  Sparkles,
} from "lucide-react";
import InfoRow from "@/components/shared/InfoRow";

interface IProductViewProps {
  open: boolean;
  onClose: () => void;
  product: IProduct | null;
}

const ProductViewDetailDialog = ({
  open,
  onClose,
  product,
}: IProductViewProps) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
  <DialogContent className="w-full max-w-[95vw] md:max-w-2xl lg:max-w-3xl max-h-[90vh] flex flex-col p-0">
    <DialogHeader className="px-4 md:px-6 pt-6 pb-4">
      <DialogTitle>Product Details</DialogTitle>
    </DialogHeader>

    <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6 space-y-6">
      {/* ================= HEADER (Image + basic info) ================= */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 p-4 md:p-6 bg-gradient-to from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg">
        
        {/* IMAGES */}
        <div className="w-full lg:w-1/3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {product.images?.map((img, i) => (
              <div
                key={i}
                className="w-full h-24 md:h-28 rounded-md overflow-hidden border"
              >
                <Image
                  src={img}
                  alt={`Product Image ${i}`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT MAIN INFO */}
        <div className="flex-1">
          <h2 className="text-xl md:text-3xl font-bold mb-2 break-normal">
            {product.title}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mb-3 break-all">
            {product.slug}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs md:text-sm">
              <DollarSign className="h-4 w-4 mr-1" />${product.price}
            </Badge>

            <Badge variant="outline" className="text-xs md:text-sm break-all">
              <Barcode className="h-4 w-4 mr-1" />
              {product.barcode}
            </Badge>

            {product.newArrival && (
              <Badge className="bg-green-600 text-white text-xs md:text-sm">
                <Sparkles className="h-4 w-4 mr-1" /> New Arrival
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ================= BASIC INFORMATION ================= */}
      <div>
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <Tag className="h-5 w-5 text-blue-600" />
          <h3 className="text-base md:text-lg font-semibold">Basic Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg">
          <InfoRow label="Title" value={product.title} />
          <InfoRow label="SKU" value={product.sku || 'N/A'} />

          <InfoRow label="Color" value={product.color || 'N/A'} />
          <InfoRow label="Price" value={`$${product.price}`} />
          <InfoRow label="Barcode" value={product.barcode || 'N/A'} />
        </div>
      </div>

      <Separator />

      {/* ================= CATEGORIES ================= */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-base md:text-lg">Categories</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.productCategory?.map((cat, i) => (
            <Badge key={i} variant="outline" className="px-3 py-1 text-sm">
              {cat.category?.name ?? "Unknown"}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* ================= VARIANTS ================= */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Boxes className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-base md:text-lg">Variant Options</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {product.variantOption?.map((variant, i) => (
            <div key={i} className="flex justify-around p-4 border rounded-lg bg-muted/30">
              <InfoRow label="Size" value={variant.size} />
              <InfoRow label="Stock" value={variant.stock.toString()} />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* ================= DESCRIPTION ================= */}
      {product.description && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-base md:text-lg">Description</h3>
          </div>

          <div className="bg-muted/40 p-4 rounded-lg space-y-4">
            <InfoRow label="Intro" value={product.description.intro || 'N/A'} />

            <div>
              <p className="font-medium mb-1">Bullet Points:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                {product.description.bulletPoints?.map((bp, idx) => (
                  <li key={idx}>{bp}</li>
                ))}
              </ul>
            </div>

            <InfoRow label="Outro" value={product.description.outro || 'N/A'} />
          </div>
        </div>
      )}

      <Separator />

      {/* ================= META ================= */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-base md:text-lg">Meta Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg">
          <div className="bg-muted/80 p-4 rounded-xl">
            <InfoRow label="Created At" value={formatDateTime(product.createdAt)} />
          </div>
          <div className="bg-muted/80 p-4 rounded-xl">
            <InfoRow label="Updated At" value={formatDateTime(product.updatedAt)} />
          </div>
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>

  );
};

export default ProductViewDetailDialog;
