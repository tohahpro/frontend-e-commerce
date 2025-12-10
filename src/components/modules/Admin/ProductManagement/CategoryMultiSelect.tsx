import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/types/category.interface";
import { X } from "lucide-react";

interface CategoryMultiSelectProps {
  selectedCategoryIds: string[];
  removedCategoryIds: string[];
  currentCategoryId: string;
  availableCategories: ICategory[];
  isEdit: boolean;
  onCurrentCategoryChange: (id: string) => void;
  onAddCategory: () => void;
  onRemoveCategory: (id: string) => void;
  getCategoryTitle: (id: string) => string;
  getNewCategories: () => string[];
}

const CategoryMultiSelect = ({
  selectedCategoryIds,
  removedCategoryIds,
  currentCategoryId,
  availableCategories,
  isEdit,
  onCurrentCategoryChange,
  onAddCategory,
  onRemoveCategory,
  getCategoryTitle,
  getNewCategories,
}: CategoryMultiSelectProps) => {
  return (
    <Field>
      <FieldLabel htmlFor="categories">Categories (Required)</FieldLabel>

      {/* Hidden Inputs for Form Submission */}
      <Input
        type="hidden"
        name="categories"
        value={JSON.stringify(
          isEdit ? getNewCategories() : selectedCategoryIds
        )}
      />
      {isEdit && (
        <Input
          type="hidden"
          name="removeCategories"
          value={JSON.stringify(removedCategoryIds)}
        />
      )}

      {/* Selected Categories Display */}
      {selectedCategoryIds?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 p-3 bg-muted rounded-lg">
          {selectedCategoryIds?.map((id) => (
            <Badge key={id} variant="secondary" className="px-3 py-1.5 text-sm">
              {getCategoryTitle(id)}
              <Button
                variant="link"
                onClick={() => onRemoveCategory(id)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add Category Selector */}
      <div className="grid grid-cols-12 md:flex gap-1">
        <Select
          value={currentCategoryId}
          onValueChange={onCurrentCategoryChange}
        >
          <SelectTrigger className="col-span-9 gap-1 md:w-full md:flex-1">
            <SelectValue placeholder="Select a Category Add" />
          </SelectTrigger>
          <SelectContent>
            {availableCategories?.length > 0 ? (
              availableCategories?.map((category) => (
                <SelectItem key={category?.id} value={category?.id}>
                  {category?.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                {selectedCategoryIds?.length > 0
                  ? "All specialties selected"
                  : "No specialties available"}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Button
          type="button"
          className="col-span-3"
          onClick={onAddCategory}
          disabled={!currentCategoryId}
          variant="outline"
        >
          Add
        </Button>
      </div>

      <p className="text-xs text-gray-500 mt-1">
        {isEdit
          ? "Add new specialties or remove existing ones"
          : "Select at least one Category for the doctor"}
      </p>

      {/* Edit Mode: Show Changes */}
      {isEdit && (
        <div className="mt-2 space-y-1">
          {getNewCategories()?.length > 0 && (
            <p className="text-xs text-green-600">
              ✓ Will add:{" "}
              {getNewCategories()?.map(getCategoryTitle)?.join(", ")}
            </p>
          )}
          {removedCategoryIds?.length > 0 && (
            <p className="text-xs text-red-600">
              ✗ Will remove:{" "}
              {removedCategoryIds?.map(getCategoryTitle)?.join(", ")}
            </p>
          )}
        </div>
      )}
    </Field>
  );
};

export default CategoryMultiSelect;