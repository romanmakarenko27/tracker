"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ExpenseFormData, Expense } from "@/types/expense";
import { CATEGORY_NAMES } from "@/lib/constants";
import { centsToDollars, todayISO } from "@/lib/formatters";
import { validateExpenseForm, hasErrors, ValidationErrors } from "@/lib/validators";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (data: ExpenseFormData) => void;
  mode: "create" | "edit";
}

export function ExpenseForm({ expense, onSubmit, mode }: ExpenseFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: expense ? centsToDollars(expense.amount) : "",
    category: expense?.category || "",
    description: expense?.description || "",
    date: expense?.date || todayISO(),
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateExpenseForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(formData);
    toast.success(mode === "create" ? "Expense added!" : "Expense updated!");
    router.push("/expenses");
  };

  const handleChange = (field: keyof ExpenseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof ValidationErrors];
        return next;
      });
    }
  };

  const categoryOptions = [
    { value: "", label: "Select a category" },
    ...CATEGORY_NAMES.map((c) => ({ value: c, label: c })),
  ];

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <Input
            label="Amount ($)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            error={errors.amount}
          />
          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            error={errors.category}
          />
          <Input
            label="Description"
            type="text"
            placeholder="What was this expense for?"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            error={errors.description}
            maxLength={200}
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            error={errors.date}
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit">
              {mode === "create" ? "Add Expense" : "Save Changes"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.push("/expenses")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
