"use client";

import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Expense, ExpenseFormData } from "@/types/expense";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEY } from "@/lib/constants";
import { dollarsToCents } from "@/lib/formatters";

export function useExpenses() {
  const [expenses, setExpenses, isLoaded] = useLocalStorage<Expense[]>(STORAGE_KEY, []);

  const addExpense = useCallback(
    (formData: ExpenseFormData): Expense => {
      const now = new Date().toISOString();
      const expense: Expense = {
        id: uuidv4(),
        amount: dollarsToCents(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        date: formData.date,
        createdAt: now,
        updatedAt: now,
      };
      setExpenses((prev) => [expense, ...prev]);
      return expense;
    },
    [setExpenses]
  );

  const updateExpense = useCallback(
    (id: string, formData: ExpenseFormData): Expense | null => {
      let updated: Expense | null = null;
      setExpenses((prev) =>
        prev.map((e) => {
          if (e.id === id) {
            updated = {
              ...e,
              amount: dollarsToCents(formData.amount),
              category: formData.category,
              description: formData.description.trim(),
              date: formData.date,
              updatedAt: new Date().toISOString(),
            };
            return updated;
          }
          return e;
        })
      );
      return updated;
    },
    [setExpenses]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    },
    [setExpenses]
  );

  const getExpense = useCallback(
    (id: string): Expense | undefined => {
      return expenses.find((e) => e.id === id);
    },
    [expenses]
  );

  return {
    expenses,
    isLoaded,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpense,
  };
}
