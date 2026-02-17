export const STORAGE_KEY = "expense-tracker-expenses";

export interface CategoryDef {
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const CATEGORIES: CategoryDef[] = [
  { name: "Food", color: "#f59e0b", bgColor: "bg-amber-100", textColor: "text-amber-800" },
  { name: "Transportation", color: "#3b82f6", bgColor: "bg-blue-100", textColor: "text-blue-800" },
  { name: "Entertainment", color: "#8b5cf6", bgColor: "bg-violet-100", textColor: "text-violet-800" },
  { name: "Shopping", color: "#ec4899", bgColor: "bg-pink-100", textColor: "text-pink-800" },
  { name: "Bills", color: "#ef4444", bgColor: "bg-red-100", textColor: "text-red-800" },
  { name: "Other", color: "#6b7280", bgColor: "bg-gray-100", textColor: "text-gray-800" },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export function getCategoryDef(name: string): CategoryDef {
  return CATEGORIES.find((c) => c.name === name) || CATEGORIES[CATEGORIES.length - 1];
}
