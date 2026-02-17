"use client";

import { Header } from "@/components/layout/Header";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { useExpenses } from "@/hooks/useExpenses";

export default function NewExpensePage() {
  const { addExpense } = useExpenses();

  return (
    <div>
      <Header title="Add Expense" />
      <ExpenseForm mode="create" onSubmit={addExpense} />
    </div>
  );
}
