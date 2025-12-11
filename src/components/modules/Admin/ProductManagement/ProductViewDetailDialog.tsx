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
  Palette,
  Boxes,
  Sparkles,
} from "lucide-react";
import InfoRow from "@/components/shared/InfoRow";

interface IProductViewProps {
  open: boolean;
  onClose: () => void;
  product: IProduct | null;
}

const ProductViewDetailDialog = ({ open, onClose, product }: IProductViewProps) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">

          {/* ================= HEADER SECTION ================= */}
          <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg mb-6">
            {/* Images */}
            <div className="flex gap-2 lg:w-1/3">
              <div className="grid grid-cols-3 gap-2">
                {product.images?.map((img, i) => (
                  <div key={i} className="w-full h-24 rounded-md overflow-hidden border">
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

            {/* Product Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
              <p className="text-sm text-muted-foreground mb-3">{product.slug}</p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${product.price}
                </Badge>

                <Badge variant="outline" className="text-sm">
                  <Barcode className="h-4 w-4 mr-1" />
                  {product.barcode}
                </Badge>

                {product.newArrival && (
                  <Badge variant="default" className="bg-green-600 text-white text-sm">
                    <Sparkles className="h-4 w-4 mr-1" />
                    New Arrival
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* ================= BASIC INFORMATION ================= */}
          <div className="space-y-6">

            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg">
                <InfoRow label="Title" value={product.title} />
                <InfoRow label="SKU" value={product.sku || 'N/A'} />

                <div className="flex items-start gap-3">
                  <Palette className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow label="Color" value={product.color || "N/A"} />
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow label="Price" value={`$${product.price}`} />
                </div>

                <div className="flex items-start gap-3">
                  <Barcode className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow label="Barcode" value={product.barcode || 'N/A'} />
                </div>
              </div>
            </div>

            <Separator />

            {/* ================= CATEGORIES ================= */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Layers className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">Categories</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.productCategory?.map((cat, i) => (
                  <Badge key={i} variant="outline" className="px-3 py-1 text-sm">
                    {cat.category?.name || "Unknown Category"}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* ================= VARIANTS ================= */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Boxes className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-lg">Variant Options</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {product.variantOption?.map((variant, i) => (
                  <div
                    key={i}
                    className="p-4 border rounded-lg bg-muted/30 flex flex-col gap-2"
                  >
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
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">Description</h3>
                </div>

                <div className="bg-muted/40 p-4 rounded-lg space-y-4">
                  <InfoRow
                    label="Intro"
                    value={product.description?.intro || "No intro available"}
                  />

                  <div>
                    <p className="font-medium mb-1">Bullet Points:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      {product.description.bulletPoints?.map((bp, idx) => (
                        <li key={idx}>{bp}</li>
                      ))}
                    </ul>
                  </div>

                  <InfoRow
                    label="Outro"
                    value={product.description?.outro || "No outro available"}
                  />
                </div>
              </div>
            )}

            <Separator />

            {/* ================= META ================= */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-lg">Meta Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg">
                <InfoRow label="Created At" value={formatDateTime(product.createdAt)} />
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
