"use client";

import SearchFilter from "@/components/shared/SearchFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown, Filter, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import RefreshButton from "./RefreshButton";

interface ProductFiltersProps {
  categories: { id: string; name: string }[];
}

const ProductFilters = ({ categories }: ProductFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const [, startTransition] = useTransition();

  // Local state
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("searchValue") || ""
  );

  const [localCategories, setLocalCategories] = useState<string[]>(
    () => searchParams.getAll("categories") || []
  );

  const [newArrivalInput, setNewArrivalInput] = useState(
    () => searchParams.get("newArrival") || ""
  );

  // Debounced
  const debouncedSearch = useDebounce(searchInput, 500);

  // Apply filters when debounced values change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Search
    if (debouncedSearch) {
      params.set("searchValue", debouncedSearch);
    } else {
      params.delete("searchValue");
    }

    // New Arrival
    if (newArrivalInput) {
      params.set("newArrival", newArrivalInput);
    } else {
      params.delete("newArrival");
    }

    // Reset page
    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [debouncedSearch, newArrivalInput]);

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    const newSelection = localCategories.includes(categoryId)
      ? localCategories.filter((id) => id !== categoryId)
      : [...localCategories, categoryId];

    setLocalCategories(newSelection);
  };

  const applyCategoryFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("categories");
    localCategories.forEach((val) => params.append("categories", val));
    params.set("page", "1");

    startTransition(() => router.push(`?${params.toString()}`));
    setOpen(false);
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setLocalCategories([]);
    setNewArrivalInput("");
    startTransition(() => router.push(window.location.pathname));
  };

  const activeFiltersCount =
    localCategories.length + (newArrivalInput ? 1 : 0) + (searchInput ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Row 1: Search + Refresh */}
      <div className="flex items-center gap-3">
        <SearchFilter paramName="searchValue" placeholder="Search products..." />
        <RefreshButton />
      </div>

      {/* Row 2: Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Categories */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-60 h-10 justify-between">
              <Filter className="mr-2 h-4 w-4" />
              {localCategories.length > 0
                ? `${localCategories.length} selected`
                : "Select categories"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search categories..." />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  {categories.map((cat) => {
                    const isSelected = localCategories.includes(cat.id);
                    return (
                      <CommandItem
                        key={cat.id}
                        value={cat.name}
                        onSelect={() => toggleCategory(cat.id)}
                        className={isSelected ? "bg-accent" : ""}
                      >
                        <Checkbox checked={isSelected} className="mr-2" />
                        <span className={isSelected ? "font-medium" : ""}>{cat.name}</span>
                        {isSelected && <Check className="ml-auto h-4 w-4 text-primary" />}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
              <div className="p-2 border-t">
                <Button onClick={applyCategoryFilter} className="w-full" size="sm">
                  Apply Filter
                </Button>
              </div>
            </Command>
          </PopoverContent>
        </Popover>

        {/* New Arrival */}
        <Select
          value={newArrivalInput}
          onValueChange={(value) => setNewArrivalInput(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[140px] h-10">
            <SelectValue placeholder="New Arrival" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearAllFilters} className="h-10 px-3">
            <X className="h-4 w-4 mr-1" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Row 3: Active Category Badges */}
      {localCategories.length > 0 && (
        <div className="min-h-8 flex items-center">
          <div className="flex flex-wrap gap-2">
            {localCategories.map((catId) => {
              const catName = categories.find((c) => c.id === catId)?.name || catId;
              return (
                <Badge key={catId} variant="outline" className="px-2.5 py-1 h-7">
                  {catName}
                  <Button
                    variant="ghost"
                    onClick={() => toggleCategory(catId)}
                    className="ml-1.5 hover:text-destructive transition-colors"
                    aria-label={`Remove ${catName}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
