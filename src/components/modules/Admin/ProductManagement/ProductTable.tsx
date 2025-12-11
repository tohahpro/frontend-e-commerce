/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ManagementTable from "@/components/shared/ManagementTable";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ProductTestFormDialog from "./ProductTestFormDialog";
import { IProduct } from "@/types/product.interface";
import { ICategory } from "@/types/category.interface";
import { useDeleteProductMutation } from "@/components/redux/features/product/product.api";
import { productsColumns } from "./productsColumns";
import ProductViewDetailDialog from "./ProductViewDetailDialog";

interface ProductTableProps {
  products: IProduct[];
  categories: ICategory[];
}

const ProductsTable = ({ products, categories }: ProductTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<IProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteProduct] = useDeleteProductMutation();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (product: IProduct) => {
    setViewingProduct(product);
  };

  const handleEdit = (product: IProduct) => {
    setEditingProduct(product);
  };

  const handleDelete = (product: IProduct) => {
    setDeletingProduct(product);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      setIsDeleting(true);

      const res = await deleteProduct(deletingProduct.id!).unwrap(); // ✅ FIXED

      toast.success(res?.message || "Product deleted successfully");

      setDeletingProduct(null);
      handleRefresh();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ManagementTable
        data={products}
        columns={productsColumns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(doctor) => doctor.id!}
        emptyMessage="No products found"
      />
      {/* Edit Doctor Form Dialog */}
      <ProductTestFormDialog
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct!}
        categories={categories}
        onSuccess={() => {
          setEditingProduct(null);
          handleRefresh();
        }}
      />

      {/* View Doctor Detail Dialog */}
      <ProductViewDetailDialog
        open={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
        product={viewingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        onConfirm={confirmDelete}
        title="Delete Doctor"
        description={`Are you sure you want to delete ${deletingProduct?.title}? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ProductsTable;
