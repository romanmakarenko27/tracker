"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Header } from "@/components/layout/Header";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { DeleteConfirmModal } from "@/components/expenses/DeleteConfirmModal";
import { Button } from "@/components/ui/Button";
import { useExpenses } from "@/hooks/useExpenses";
import { useExpenseFilters } from "@/hooks/useExpenseFilters";

export default function ExpensesPage() {
  const { expenses, isLoaded, deleteExpense, getExpense } = useExpenses();
  const { filters, filteredExpenses, updateFilter, resetFilters, hasActiveFilters } =
    useExpenseFilters(expenses);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const expenseToDelete = deleteId ? getExpense(deleteId) : undefined;

  const handleDelete = () => {
    if (deleteId) {
      deleteExpense(deleteId);
      toast.success("Expense deleted!");
      setDeleteId(null);
    }
  };

  // Sort by date descending, then by createdAt descending
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <div>
      <Header title="Expenses">
        <Link href="/expenses/new">
          <Button>Add Expense</Button>
        </Link>
      </Header>

      <ExpenseFilters
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {isLoaded && hasActiveFilters && (
        <p className="text-sm text-gray-500 mb-3">
          Showing {sortedExpenses.length} of {expenses.length} expenses
        </p>
      )}

      <ExpenseList expenses={sortedExpenses} onDelete={setDeleteId} isLoaded={isLoaded} />

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        description={expenseToDelete?.description}
      />
    </div>
  );
}
