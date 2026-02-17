"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { useExpenses } from "@/hooks/useExpenses";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";

export default function EditExpensePage() {
  const params = useParams();
  const { getExpense, updateExpense, isLoaded } = useExpenses();

  const id = params.id as string;
  const expense = getExpense(id);

  if (!isLoaded) {
    return (
      <div>
        <Header title="Edit Expense" />
        <Card>
          <CardContent>
            <div className="animate-pulse space-y-4 py-2">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!expense) {
    return (
      <div>
        <Header title="Expense Not Found" />
        <Card>
          <div className="p-12 text-center">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Expense not found</h3>
            <p className="text-sm text-gray-500 mb-4">This expense may have been deleted.</p>
            <Link
              href="/expenses"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Expenses
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Header title="Edit Expense" />
      <ExpenseForm
        mode="edit"
        expense={expense}
        onSubmit={(data) => updateExpense(id, data)}
      />
    </div>
  );
}
