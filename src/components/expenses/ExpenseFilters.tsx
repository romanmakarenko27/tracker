"use client";

import { ExpenseFilters as Filters } from "@/types/expense";
import { CATEGORY_NAMES } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface ExpenseFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function ExpenseFilters({ filters, onFilterChange, onReset, hasActiveFilters }: ExpenseFiltersProps) {
  const categoryOptions = [
    { value: "All", label: "All Categories" },
    ...CATEGORY_NAMES.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <Select
          label="Category"
          options={categoryOptions}
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
        />
        <Input
          label="From"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onFilterChange("dateFrom", e.target.value)}
        />
        <Input
          label="To"
          type="date"
          value={filters.dateTo}
          onChange={(e) => onFilterChange("dateTo", e.target.value)}
        />
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
