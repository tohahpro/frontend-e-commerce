"use client"

import { useState, useTransition } from "react";
import ProductFormDialog from "./ProductFormDialog";
import { useRouter } from "next/navigation";
import { ICategory } from "@/types/category.interface";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { Plus } from "lucide-react";


interface ProductManagementHeaderProps {
    categories?: ICategory[];
}

const ProductManagementHeader = ({
    categories
}: ProductManagementHeaderProps) => {

    const router = useRouter();

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [dialogKey, setDialogKey] = useState(0);

    const [, startTransition] = useTransition();

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    }

    const handleOpenDialog = () => {
        setDialogKey((prev) => prev + 1)
        setIsDialogOpen(true);
    }

    const handleSuccess = () => {
        startTransition(() => {
            router.refresh();
        })
    }

    return (
        <div>
            <ProductFormDialog
                key={dialogKey}
                open={isDialogOpen}
                onClose={handleCloseDialog}
                onSuccess={handleSuccess}
                categories={categories}
            />


            <ManagementPageHeader
                title="Product Management"
                description="Manage Products information and details"
                action={{
                    label: "Add Product",
                    icon: Plus,
                    onClick: handleOpenDialog
                }}
            />

        </div>
    );
};

export default ProductManagementHeader;