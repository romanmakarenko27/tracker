"use client";

import { useState, useMemo } from "react";
import { Expense, ExpenseFilters } from "@/types/expense";

const defaultFilters: ExpenseFilters = {
  dateFrom: "",
  dateTo: "",
  category: "All",
};

export function useExpenseFilters(expenses: Expense[]) {
  const [filters, setFilters] = useState<ExpenseFilters>(defaultFilters);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (filters.category !== "All" && e.category !== filters.category) {
        return false;
      }
      if (filters.dateFrom && e.date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && e.date > filters.dateTo) {
        return false;
      }
      return true;
    });
  }, [expenses, filters]);

  const updateFilter = (key: keyof ExpenseFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters =
    filters.category !== "All" || filters.dateFrom !== "" || filters.dateTo !== "";

  return {
    filters,
    filteredExpenses,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  };
}
