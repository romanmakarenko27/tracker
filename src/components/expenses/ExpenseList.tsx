"use client";

import { Expense } from "@/types/expense";
import { ExpenseListItem } from "./ExpenseListItem";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  isLoaded: boolean;
}

export function ExpenseList({ expenses, onDelete, isLoaded }: ExpenseListProps) {
  if (!isLoaded) {
    return (
      <Card>
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <div className="p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No expenses found</h3>
          <p className="text-sm text-gray-500 mb-4">Get started by adding your first expense.</p>
          <Link
            href="/expenses/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Expense
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="divide-y divide-gray-100">
        {expenses.map((expense) => (
          <ExpenseListItem key={expense.id} expense={expense} onDelete={onDelete} />
        ))}
      </div>
    </Card>
  );
}
