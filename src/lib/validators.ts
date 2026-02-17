import { ExpenseFormData } from "@/types/expense";
import { CATEGORY_NAMES } from "./constants";

export interface ValidationErrors {
  amount?: string;
  category?: string;
  description?: string;
  date?: string;
}

export function validateExpenseForm(data: ExpenseFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const amount = parseFloat(data.amount);
  if (!data.amount || isNaN(amount)) {
    errors.amount = "Amount is required";
  } else if (amount <= 0) {
    errors.amount = "Amount must be greater than zero";
  } else if (amount > 999999.99) {
    errors.amount = "Amount is too large";
  }

  if (!data.category || !CATEGORY_NAMES.includes(data.category)) {
    errors.category = "Please select a category";
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = "Description is required";
  } else if (data.description.trim().length > 200) {
    errors.description = "Description must be 200 characters or less";
  }

  if (!data.date) {
    errors.date = "Date is required";
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
