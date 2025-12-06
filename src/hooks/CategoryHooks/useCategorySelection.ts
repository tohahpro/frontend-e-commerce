import { ICategory } from "@/types/category.interface";
import { IProduct } from "@/types/product.interface";
import { useEffect, useState } from "react";

interface UseCategorySelectionProps {
  product?: IProduct;
  isEdit: boolean;
  open: boolean;
}

interface UseCategorySelectionReturn {
  selectedCategoryIds: string[];
  removedCategoryIds: string[];
  currentCategoryId: string;
  setCurrentCategoryId: (id: string) => void;
  handleAddCategory: () => void;
  handleRemoveCategory: (id: string) => void;
  getNewCategories: () => string[];
  getAvailableCategories: (allCategories: ICategory[]) => ICategory[];
}

export const useCategorySelection = ({
  product,
  isEdit,
  open,
}: UseCategorySelectionProps): UseCategorySelectionReturn => {
  
  // Extract initial categoryIds from product.productCategory
  const getInitialCategoryIds = () => {
    if (isEdit && product?.productCategory) {
      return (
        product.productCategory
          .map((pc) => pc.categoryId)
          .filter((id): id is string => !!id) || []
      );
    }
    return [];
  };

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(getInitialCategoryIds);
  const [removedCategoryIds, setRemovedCategoryIds] = useState<string[]>([]);
  const [currentCategoryId, setCurrentCategoryId] = useState<string>("");

  // Add new selected category
  const handleAddCategory = () => {
    if (currentCategoryId && !selectedCategoryIds.includes(currentCategoryId)) {
      setSelectedCategoryIds([...selectedCategoryIds, currentCategoryId]);

      // Remove from "removed" list if re-added
      if (removedCategoryIds.includes(currentCategoryId)) {
        setRemovedCategoryIds(removedCategoryIds.filter((id) => id !== currentCategoryId));
      }

      setCurrentCategoryId("");
    }
  };

  // Remove selected category
  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== categoryId));

    // When editing, track removed categories
    if (isEdit && product?.productCategory) {
      const wasOriginal = product.productCategory.some((pc) => pc.categoryId === categoryId);

      if (wasOriginal && !removedCategoryIds.includes(categoryId)) {
        setRemovedCategoryIds([...removedCategoryIds, categoryId]);
      }
    }
  };

  // New categories = added categories that were not originally part of product
  const getNewCategories = (): string[] => {
    if (!isEdit || !product?.productCategory) return selectedCategoryIds;

    const originalIds = product.productCategory.map((pc) => pc.categoryId);

    return selectedCategoryIds.filter((id) => !originalIds.includes(id));
  };

  // Available categories (not selected)
  const getAvailableCategories = (allCategories: ICategory[]) => {
    return allCategories.filter((cat) => !selectedCategoryIds.includes(cat.id));
  };

  // Reset on modal open
  useEffect(() => {
    if (open && product) {
      const initial = getInitialCategoryIds();
      setSelectedCategoryIds(initial);
      setRemovedCategoryIds([]);
      setCurrentCategoryId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product?.id]);

  return {
    selectedCategoryIds,
    removedCategoryIds,
    currentCategoryId,
    setCurrentCategoryId,
    handleAddCategory,
    handleRemoveCategory,
    getNewCategories,
    getAvailableCategories,
  };
};
