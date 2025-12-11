/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Column } from "@/components/shared/ManagementTable";
import Image from "next/image";
import { IProduct } from "@/types/product.interface";
import { DateCell } from "@/components/shared/cell/DateCell";

// Utility component for product + image
const ProductInfoCell = ({ title, slug, img }: { title: string; slug: string; img: string }) => (
  <div className="flex items-center gap-3">
    <div className="h-12 w-12 rounded-md overflow-hidden border">
      <Image src={img} alt={title} width={48} height={48} className="object-cover" />
    </div>
    <div className="flex flex-col">
      <span className="font-medium">{title}</span>
      <span className="text-xs text-gray-500">{slug}</span>
    </div>
  </div>
);

export const productsColumns: Column<IProduct>[] = [
  // Product + Image
  {
    header: "Product",
    accessor: (product) => (
      <ProductInfoCell
        title={product.title}
        slug={product.slug}
        img={product.images?.[0] || "/placeholder.png"}
      />
    ),
    sortKey: "title",
  },

  // Price
  {
    header: "Price",
    accessor: (product) => (
      <span className="font-semibold text-green-600">${product.price}</span>
    ),
    sortKey: "price",
  },

  // SKU
  {
    header: "SKU",
    accessor: (product) => <span className="text-sm">{product.sku}</span>,
    sortKey: "sku",
  },

  // Color
  {
    header: "Color",
    accessor: (product) => (
      <span className="text-sm capitalize">{product.color || "N/A"}</span>
    ),
  },

  // Categories
  {
    header: "Categories",
    accessor: (product) => {
      if (!product.productCategory?.length) {
        return <span className="text-xs text-gray-500">No Category</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {product.productCategory.map((cat: any) => (
            <span
              key={cat.categoryId}
              className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
            >
              {cat.category?.title || cat.categoryId}
            </span>
          ))}
        </div>
      );
    },
  },

  // Stock (Total stock across variants)
  {
    header: "Total Stock",
    accessor: (product) => {
      const totalStock = product.variantOption?.reduce(
        (sum, item) => sum + (item.stock || 0),
        0
      );

      return <span className="font-medium">{totalStock ?? 0}</span>;
    },
    sortKey: "stock",
  },

  // New Arrival
  {
    header: "New Arrival",
    accessor: (product) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          product.newArrival
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {product.newArrival ? "Yes" : "No"}
      </span>
    ),
    sortKey: "newArrival",
  },

  // CreatedAt
  {
    header: "Created",
    accessor: (product) => <DateCell date={product.createdAt} />,
    sortKey: "createdAt",
  },
];
