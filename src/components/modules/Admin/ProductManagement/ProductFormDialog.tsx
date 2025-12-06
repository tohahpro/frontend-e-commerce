/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CategoryMultiSelect from "./CategoryMultiSelect";
import { useCategorySelection } from "@/hooks/CategoryHooks/useCategorySelection";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FileMetadata } from "@/hooks/use-file-upload";
import MultipleImageUploader from "@/components/MultipleImageUploader";
import { createProduct, updateProduct } from "@/services/admin/productManagement";
import { toast } from "sonner";
import InputFieldError from "@/components/shared/InputFieldError";

interface IProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
  categories?: any[];
}

const ProductFormDialog = ({ open, onClose, onSuccess, product, categories }: IProductFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [images, setImages] = useState<(File | FileMetadata)[]>([]);
  const isEdit = !!product;

  const [bulletPoints, setBulletPoints] = useState<string[]>(product?.description?.bulletPoints || [""]);
  const [variantOptions, setVariantOptions] = useState<Array<{ size: string; stock: number }>>(
    product?.variantOptions || [{ size: "", stock: 0 }]
  );

  const categorySelection = useCategorySelection({ product, isEdit, open });

  const handleClose = () => {
    formRef.current?.reset();
    onClose();
  };

  // ======================
  // BulletPoints Actions
  // ======================
  const addBulletPoint = () => setBulletPoints([...bulletPoints, ""]);
  const removeBulletPoint = (index: number) => setBulletPoints(bulletPoints.filter((_, i) => i !== index));
  const updateBulletPoint = (index: number, value: string) => {
    const updated = [...bulletPoints];
    updated[index] = value;
    setBulletPoints(updated);
  };

  // ======================
  // Variants Actions
  // ======================
  const addVariant = () => setVariantOptions([...variantOptions, { size: "", stock: 0 }]);
  const removeVariant = (index: number) => setVariantOptions(variantOptions.filter((_, i) => i !== index));
  const updateVariant = (index: number, field: "size" | "stock", value: string | number) => {
    const updated = [...variantOptions];
    updated[index] = { ...updated[index], [field]: value };
    setVariantOptions(updated);
  };

  // ======================
  // useActionState
  // ======================
  const [state, formAction, isPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      try {
        // Append additional fields
        images.forEach((img) => formData.append("images", img as File));
        formData.append("bulletPoints", JSON.stringify(bulletPoints));
        formData.append("variants", JSON.stringify(variantOptions));
        formData.append("categories", JSON.stringify(categorySelection.getNewCategories()));

        // Call backend service
        return isEdit
          ? await updateProduct(_prevState, product.id, formData)
          : await createProduct(_prevState, formData);
      } catch (error: any) {
        console.error("Form action error:", error);
        return { success: false, message: error.message || "Something went wrong" };
      }
    },
    null
  );

  // ======================
  // Handle Success/Error
  // ======================
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || (isEdit ? "Product updated" : "Product created"));
      formRef.current?.reset();      
      onSuccess();
      onClose();
    } else if (state && !state.success) {
      toast.error(state.message || "Failed to save product");
    }
  }, [state, onSuccess, onClose, isEdit]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{isEdit ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);

            startTransition(() => {
              formAction(fd);
            });
          }}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
            {/* Title */}
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input id="title" name="title" defaultValue={product?.title || ""} />
              <InputFieldError state={state} field="title" />
            </Field>

            {/* Slug */}
            <Field>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input id="slug" name="slug" defaultValue={product?.slug || ""} />
              <InputFieldError state={state} field="slug" />
            </Field>

            {/* Price & SKU */}
            <div className="md:flex md:gap-3">
              <Field>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input required id="price" name="price" type="number" defaultValue={product?.price || ""} />
                <InputFieldError state={state} field="price" />
              </Field>
              <Field>
                <FieldLabel htmlFor="sku">SKU</FieldLabel>
                <Input id="sku" name="sku" defaultValue={product?.sku || ""} />
                <InputFieldError state={state} field="sku" />
              </Field>
            </div>

            {/* Barcode & Color */}
            <div className="md:flex md:gap-3">
              <Field>
                <FieldLabel htmlFor="barcode">Barcode</FieldLabel>
                <Input id="barcode" name="barcode" defaultValue={product?.barcode || ""} />
                <InputFieldError state={state} field="barcode" />
              </Field>
              <Field>
                <FieldLabel htmlFor="color">Color</FieldLabel>
                <Input id="color" name="color" defaultValue={product?.color || ""} />
                <InputFieldError state={state} field="color" />
              </Field>
            </div>

            {/* New Arrival */}
            <Field>
              <FieldLabel>New Arrival</FieldLabel>
              <Select name="arrival" defaultValue={String(product?.arrival || "false")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
              {/* <InputFieldError state={state} field="arrival" /> */}
            </Field>

            {/* Categories */}
            <CategoryMultiSelect
              selectedCategoryIds={categorySelection.selectedCategoryIds}
              removedCategoryIds={categorySelection.removedCategoryIds}
              currentCategoryId={categorySelection.currentCategoryId}
              availableCategories={categorySelection.getAvailableCategories(categories!)}
              isEdit={isEdit}
              onCurrentCategoryChange={categorySelection.setCurrentCategoryId}
              onAddCategory={categorySelection.handleAddCategory}
              onRemoveCategory={categorySelection.handleRemoveCategory}
              getCategoryTitle={(id) => categories?.find((c) => c.id === id)?.name || "Unknown"}
              getNewCategories={categorySelection.getNewCategories}
            />
            <InputFieldError field="categories" state={state} />


            {/* Description */}
            <div className="border p-2 rounded-lg space-y-2">
              <p className="font-semibold text-lg">Description</p>
              <Field>
                <FieldLabel htmlFor="intro">Intro</FieldLabel>
                <Input id="intro" name="intro" defaultValue={product?.description?.intro || ""} />
                <InputFieldError state={state} field="intro" />
              </Field>

              <div className="flex justify-between items-center">
                <FieldLabel>Bullet Points</FieldLabel>
                <Button type="button" variant="outline" onClick={addBulletPoint}>
                  <Plus />
                </Button>
              </div>

              {bulletPoints.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    value={item}                    
                    placeholder={`Bullet point ${index + 1}`}
                    onChange={(e) => updateBulletPoint(index, e.target.value)}
                  />   
                  <InputFieldError field="bulletPoints" state={state} />               
                  <Button type="button" variant="destructive" onClick={() => removeBulletPoint(index)}>
                    <Trash2 />
                  </Button>
                </div>
              ))}

              <Field>
                <FieldLabel htmlFor="outro">Outro</FieldLabel>
                <Input id="outro" name="outro" defaultValue={product?.description?.outro || ""} />
                <InputFieldError state={state} field="outro" />
              </Field>              
            </div>

            {/* Variants */}
            <div className="flex justify-between items-center mt-4">
              <p className="font-semibold text-lg">Variant Options</p>
              <Button type="button" variant="outline" onClick={addVariant}>
                <Plus />
              </Button>
            </div>

            {variantOptions.map((item, index) => (
              <div key={index} className="flex justify-around items-center">
                <div>
                  <FieldLabel>Size</FieldLabel>
                  <Input                  
                    value={item.size}
                    placeholder="M / L / XL"
                    onChange={(e) => updateVariant(index, "size", e.target.value)}
                  />
                  <InputFieldError state={state} field="variantOptions" />
                </div>

                <div>
                  <FieldLabel>Stock</FieldLabel>
                  <Input
                    type="number"
                    required
                    value={item.stock}
                    onChange={(e) => updateVariant(index, "stock", Number(e.target.value))}
                  />
                </div>

                <Button type="button" variant="destructive" onClick={() => removeVariant(index)}>
                  <Trash2 />
                </Button>
              </div>
            ))}

            {/* Images */}
            <Field>
              <FieldLabel>Images</FieldLabel>
              <MultipleImageUploader onChange={setImages} />
              <InputFieldError state={state} field="images" />
            </Field>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
