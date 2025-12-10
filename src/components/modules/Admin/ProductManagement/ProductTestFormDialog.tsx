/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileMetadata } from "@/hooks/use-file-upload";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  FieldValues,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import CategoryMultiSelect from "./CategoryMultiSelect";
import { useCategorySelection } from "@/hooks/CategoryHooks/useCategorySelection";

import { toast } from "sonner";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/components/redux/features/product/product.api";
import { Textarea } from "@/components/ui/textarea";
interface IProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
  categories?: any[];
}

const ProductTestFormDialog = ({
  open,
  onClose,
  onSuccess,
  product,
  categories,
}: IProductFormDialogProps) => {
  const [images, setImages] = useState<(File | FileMetadata)[]>([]);

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const form = useForm({
    defaultValues: {
      title: "",
      slug: "",
      price: "",
      sku: "",
      barcode: "",
      color: "",
      intro: "",
      outro: "",
      arrival: "",
      bulletPoints: [{ value: "" }],
      variantOptions: [{ size: "", stock: "" }],
    },
  });

  const isEdit = !!product;
  const categorySelection = useCategorySelection({ product, isEdit, open });

  const {
    fields: bulletPointsFields,
    append: bulletPointsAppend,
    remove: bulletPointsRemove,
  } = useFieldArray({
    control: form.control,
    name: "bulletPoints",
  });
  const {
    fields: variantOptionFields,
    append: variantOptionAppend,
    remove: variantOptionRemove,
  } = useFieldArray({
    control: form.control,
    name: "variantOptions",
  });

  const handleSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();

    const productData = {
      title: data.title,
      slug: data.slug,
      price: Number(data.price),
      sku: data.sku,
      barcode: data.barcode,
      color: data.color,
      arrival: data.arrival,

      description: {
        intro: data.intro,
        bulletPoints: data.bulletPoints?.map((b: any) => b.value),
        outro: data.outro,
      },

      variantOptions: data.variantOptions?.map((item: any) => ({
        size: item.size,
        stock: Number(item.stock),
      })),

      categories: categorySelection.selectedCategoryIds,
    };

    console.log("FINAL productData", productData);

    formData.append("data", JSON.stringify(productData));
    images.forEach((image) => formData.append("files", image as File));

    try {
      if (isEdit) {
        //  UPDATE PRODUCT
        await updateProduct({ id: product.id, formData }).unwrap();
        toast.success("Product Updated");
      } else {
        //  CREATE PRODUCT
        await createProduct(formData).unwrap();
        toast.success("Product Created");
      }

      form.reset();
      onSuccess();
    } catch (error) {
      console.log(error);
      toast.error("Failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id=""
            className="flex flex-col flex-1 min-h-0"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:flex md:gap-5 space-y-2">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:flex md:gap-5 space-y-2">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Sku</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:flex md:gap-5 space-y-2">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="arrival"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>New Arrival</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || undefined}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="New Arrival" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border rounded p-4 space-y-3">
                <FormLabel className="text-center">Description</FormLabel>
                <FormField
                  control={form.control}
                  name="intro"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type product details here."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <FormLabel>Bullet Points</FormLabel>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    onClick={() => bulletPointsAppend({ value: "" })}
                  >
                    <Plus />
                  </Button>
                </div>
                <div>
                  {bulletPointsFields.map((item, index) => (
                    <div key={index} className="space-y-4 flex gap-3">
                      <FormField
                        control={form.control}
                        name={`bulletPoints.${index}.value`}
                        key={item.id}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => bulletPointsRemove(index)}
                        className=" cursor-pointer"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="outro"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Outro</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between">
                <FormLabel className="text-md">Variant Options</FormLabel>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  onClick={() => variantOptionAppend({ size: "", stock: "" })}
                >
                  <Plus />
                </Button>
              </div>

              <div className="space-y-4">
                {variantOptionFields.map((item, index) => (
                  <div key={item.id} className="flex gap-3 items-start">
                    {/* SIZE FIELD */}
                    <FormField
                      control={form.control}
                      name={`variantOptions.${index}.size`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Size</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="M / L / XL" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* STOCK FIELD */}
                    <FormField
                      control={form.control}
                      name={`variantOptions.${index}.stock`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Stock</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} placeholder="10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      variant="destructive"
                      type="button"
                      onClick={() => variantOptionRemove(index)}
                      className="cursor-pointer mt-6"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>

              <CategoryMultiSelect
                selectedCategoryIds={categorySelection.selectedCategoryIds}
                removedCategoryIds={categorySelection.removedCategoryIds}
                currentCategoryId={categorySelection.currentCategoryId}
                availableCategories={categorySelection.getAvailableCategories(
                  categories!
                )}
                isEdit={isEdit}
                onCurrentCategoryChange={categorySelection.setCurrentCategoryId}
                onAddCategory={categorySelection.handleAddCategory}
                onRemoveCategory={categorySelection.handleRemoveCategory}
                getCategoryTitle={(id) =>
                  categories?.find((c) => c.id === id)?.name || "Unknown"
                }
                getNewCategories={categorySelection.getNewCategories}
              />

              {/* Images */}
              <div className="flex-1">
                <MultipleImageUploader onChange={setImages} />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {/* {isPending ? "Saving..." : isEdit ? "Update Product" : "Create Product"} */}
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductTestFormDialog;
