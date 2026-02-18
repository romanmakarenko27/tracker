# Dashboard — Developer Documentation

> Auto-generated on 2026-02-18. Source of truth is the code itself; update this doc when the implementation changes.

## Overview

The Dashboard is the application's landing page, providing a high-level financial overview via summary metrics, spending visualizations, and a recent expenses feed. It aggregates all stored expenses into computed statistics and renders them through four distinct UI sections. The root route (`/`) redirects to `/dashboard`.

**Feature type:** Frontend-only

## Architecture

### File Map

| File | Role | Lines |
|------|------|-------|
| `src/app/page.tsx` | Root redirect to `/dashboard` | ~5 |
| `src/app/dashboard/page.tsx` | Dashboard page — orchestrates layout and data | ~47 |
| `src/components/dashboard/SummaryCards.tsx` | Renders four KPI metric cards | ~49 |
| `src/components/dashboard/RecentExpenses.tsx` | Shows latest 5 expenses | ~50 |
| `src/components/dashboard/SpendingByCategory.tsx` | Pie chart of spending per category | ~69 |
| `src/components/dashboard/SpendingOverTime.tsx` | Area chart of daily spending (30 days) | ~68 |
| `src/hooks/useExpenses.ts` | CRUD hook for expenses with localStorage | ~77 |
| `src/hooks/useLocalStorage.ts` | Generic localStorage persistence hook | ~39 |
| `src/lib/analytics.ts` | `calculateSummary` and `getCategoryData` functions | ~62 |
| `src/lib/constants.ts` | Category definitions, storage key, `getCategoryDef` | ~23 |
| `src/lib/formatters.ts` | Currency, date, and conversion formatters | ~32 |
| `src/types/expense.ts` | `Expense`, `ExpenseFormData`, `ExpenseSummary` types | ~31 |
| `src/components/ui/Card.tsx` | Reusable Card, CardHeader, CardContent | ~21 |
| `src/components/ui/Badge.tsx` | Category color badge | ~16 |
| `src/components/ui/Button.tsx` | Button with variant/size support | ~37 |
| `src/components/layout/Header.tsx` | Page header with title and action slots | ~15 |

### Dependency Graph

```
page.tsx (root)
  └── redirect → /dashboard

dashboard/page.tsx
  ├── useExpenses (hook)
  │   ├── useLocalStorage (hook)
  │   ├── STORAGE_KEY (constants)
  │   └── dollarsToCents (formatters)
  ├── calculateSummary (analytics)
  ├── Header (layout)
  ├── Button (ui)
  ├── SummaryCards
  │   ├── ExpenseSummary (type)
  │   ├── formatCurrency (formatters)
  │   └── Card (ui)
  ├── SpendingByCategory
  │   ├── recharts (PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip)
  │   ├── getCategoryData (analytics)
  │   ├── getCategoryDef (constants)
  │   ├── formatCurrency (formatters)
  │   └── Card, CardHeader, CardContent (ui)
  ├── SpendingOverTime
  │   ├── recharts (AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer)
  │   ├── formatCurrency, formatDateShort (formatters)
  │   └── Card, CardHeader, CardContent (ui)
  └── RecentExpenses
      ├── Expense (type)
      ├── formatCurrency, formatDate (formatters)
      ├── Badge (ui)
      └── Card, CardHeader, CardContent (ui)
```

### Data Flow

```
localStorage("expense-tracker-expenses")
  │
  ▼
useLocalStorage → useExpenses → expenses[] + isLoaded
  │
  ▼
DashboardPage
  ├── useMemo(calculateSummary(expenses)) → ExpenseSummary
  │   ├── totalSpent, expenseCount, averageExpense, topCategory
  │   ├── categoryTotals: Record<string, number>
  │   └── dailyTotals: { date, total }[]
  │
  ├── SummaryCards ← summary, isLoaded
  ├── SpendingByCategory ← categoryTotals
  ├── SpendingOverTime ← dailyTotals
  └── RecentExpenses ← expenses (sorts + takes top 5)
```

## Type Definitions

### Expense

```ts
// src/types/expense.ts
interface Expense {
  id: string;           // UUID v4
  amount: number;       // stored in cents (e.g., 1500 = $15.00)
  category: string;     // matches a CATEGORIES[].name value
  description: string;  // user-provided text
  date: string;         // ISO date format "YYYY-MM-DD"
  createdAt: string;    // ISO datetime string
  updatedAt: string;    // ISO datetime string
}
```

### ExpenseSummary

```ts
// src/types/expense.ts
interface ExpenseSummary {
  totalSpent: number;                        // sum of all expense amounts (cents)
  expenseCount: number;                      // total number of expenses
  averageExpense: number;                    // rounded mean (cents)
  topCategory: string;                       // category with highest spend, or "N/A"
  categoryTotals: Record<string, number>;    // category name → total cents
  dailyTotals: { date: string; total: number }[];  // last 30 days, each day's spend in cents
}
```

### CategoryDef

```ts
// src/lib/constants.ts
interface CategoryDef {
  name: string;      // e.g., "Food"
  color: string;     // hex color for charts, e.g., "#f59e0b"
  bgColor: string;   // Tailwind bg class for badges, e.g., "bg-amber-100"
  textColor: string; // Tailwind text class for badges, e.g., "text-amber-800"
}
```

## Components

### DashboardPage

- **File:** `src/app/dashboard/page.tsx`
- **Props:** None (Next.js page component)
- **State:**
  - `expenses`, `isLoaded` — via `useExpenses()` hook
  - `summary` — memoized via `useMemo(() => calculateSummary(expenses))`
- **Key behavior:**
  - Fetches all expenses from localStorage through `useExpenses`
  - Computes summary statistics with `calculateSummary`, memoized on `expenses`
  - Renders a header with "Export Hub" and "Add Expense" navigation buttons
  - Lays out four sections: SummaryCards, a 2-column grid of charts, and RecentExpenses

### SummaryCards

- **File:** `src/components/dashboard/SummaryCards.tsx`
- **Props:**

  | Prop | Type | Required | Description |
  |------|------|----------|-------------|
  | `summary` | `ExpenseSummary` | Yes | Computed expense summary |
  | `isLoaded` | `boolean` | Yes | Whether localStorage data has loaded |

- **State:** None
- **Key behavior:**
  - Renders a 2×2 (mobile) / 4×1 (desktop) grid of metric cards
  - Shows loading skeletons (pulse animation) when `isLoaded` is false
  - Displays: Total Spent (currency), Expenses (count), Average (currency), Top Category (name)
  - Uses a data-driven `cards` array to map keys to labels and formatters

### SpendingByCategory

- **File:** `src/components/dashboard/SpendingByCategory.tsx`
- **Props:**

  | Prop | Type | Required | Description |
  |------|------|----------|-------------|
  | `categoryTotals` | `Record<string, number>` | Yes | Category name → total cents |

- **State:** None
- **Key behavior:**
  - Transforms `categoryTotals` into chart data via `getCategoryData()`
  - Shows "No data to display" placeholder when empty
  - Renders a Recharts donut `PieChart` (innerRadius=50, outerRadius=80)
  - Each slice is colored by the category's `color` from `getCategoryDef()`
  - Tooltip shows formatted currency values
  - Legend labels styled in gray

### SpendingOverTime

- **File:** `src/components/dashboard/SpendingOverTime.tsx`
- **Props:**

  | Prop | Type | Required | Description |
  |------|------|----------|-------------|
  | `dailyTotals` | `{ date: string; total: number }[]` | Yes | Daily spend amounts for the last 30 days |

- **State:** None
- **Key behavior:**
  - Renders a Recharts `AreaChart` with gradient fill
  - X-axis: dates formatted with `formatDateShort` (e.g., "Feb 18")
  - Y-axis: currency-formatted values
  - Shows "No data to display" when all daily totals are zero
  - Area uses indigo (`#6366f1`) stroke and gradient fill
  - Subtitle reads "Last 30 days"

### RecentExpenses

- **File:** `src/components/dashboard/RecentExpenses.tsx`
- **Props:**

  | Prop | Type | Required | Description |
  |------|------|----------|-------------|
  | `expenses` | `Expense[]` | Yes | Full expenses array |

- **State:** None
- **Key behavior:**
  - Sorts expenses by `createdAt` (newest first) and takes the top 5
  - Shows each expense with description, category badge, formatted date, and amount
  - Shows "No expenses yet" placeholder when the list is empty
  - Includes a "View All" link to `/expenses`

## Hooks

### useExpenses

- **File:** `src/hooks/useExpenses.ts`
- **Parameters:** None
- **Returns:**
  ```ts
  {
    expenses: Expense[];
    isLoaded: boolean;
    addExpense: (formData: ExpenseFormData) => Expense;
    updateExpense: (id: string, formData: ExpenseFormData) => Expense | null;
    deleteExpense: (id: string) => void;
    getExpense: (id: string) => Expense | undefined;
  }
  ```
- **Side effects:** Reads/writes to localStorage under key `"expense-tracker-expenses"`
- **Usage by Dashboard:** Only `expenses` and `isLoaded` are consumed

### useLocalStorage

- **File:** `src/hooks/useLocalStorage.ts`
- **Parameters:** `key: string`, `initialValue: T`
- **Returns:** `[storedValue: T, setValue: (value: T | ((val: T) => T)) => void, isLoaded: boolean]`
- **Side effects:**
  - Reads from `window.localStorage` on mount
  - Writes to `window.localStorage` on every `setValue` call
  - Logs errors to `console.error` on read/write failures
- **Usage example:**
  ```ts
  const [expenses, setExpenses, isLoaded] = useLocalStorage<Expense[]>("expense-tracker-expenses", []);
  ```

## Utility Functions

### calculateSummary

- **File:** `src/lib/analytics.ts`
- **Signature:** `calculateSummary(expenses: Expense[]): ExpenseSummary`
- **Purpose:** Computes aggregate statistics from the full expenses array — total spend, count, average, top category, per-category totals, and daily totals for the last 30 days
- **Edge cases:**
  - Returns `averageExpense: 0` when there are no expenses
  - Returns `topCategory: "N/A"` when there are no expenses
  - Days with no expenses in the 30-day window appear with `total: 0`

### getCategoryData

- **File:** `src/lib/analytics.ts`
- **Signature:** `getCategoryData(categoryTotals: Record<string, number>): { name: string; value: number }[]`
- **Purpose:** Converts categoryTotals map into a sorted array for chart rendering (descending by value)
- **Edge cases:** Returns empty array when `categoryTotals` is empty

### formatCurrency

- **File:** `src/lib/formatters.ts`
- **Signature:** `formatCurrency(cents: number): string`
- **Purpose:** Converts cents to a USD currency string (e.g., `1500` → `"$15.00"`)

### formatDate

- **File:** `src/lib/formatters.ts`
- **Signature:** `formatDate(dateStr: string): string`
- **Purpose:** Formats ISO date string to readable form (e.g., `"2026-02-18"` → `"Feb 18, 2026"`)

### formatDateShort

- **File:** `src/lib/formatters.ts`
- **Signature:** `formatDateShort(dateStr: string): string`
- **Purpose:** Formats ISO date string to abbreviated form (e.g., `"2026-02-18"` → `"Feb 18"`)

### getCategoryDef

- **File:** `src/lib/constants.ts`
- **Signature:** `getCategoryDef(name: string): CategoryDef`
- **Purpose:** Looks up category styling by name. Falls back to the last category ("Other") if not found.

## Constants & Configuration

| Constant | Value | Purpose |
|----------|-------|---------|
| `STORAGE_KEY` | `"expense-tracker-expenses"` | localStorage key for persisting expenses |
| `CATEGORIES` | Array of 6 `CategoryDef` objects | Defines available categories: Food, Transportation, Entertainment, Shopping, Bills, Other |
| `CATEGORY_NAMES` | `string[]` | Derived list of category name strings |

### Category Definitions

| Category | Chart Color | Badge BG | Badge Text |
|----------|-------------|----------|------------|
| Food | `#f59e0b` (amber) | `bg-amber-100` | `text-amber-800` |
| Transportation | `#3b82f6` (blue) | `bg-blue-100` | `text-blue-800` |
| Entertainment | `#8b5cf6` (violet) | `bg-violet-100` | `text-violet-800` |
| Shopping | `#ec4899` (pink) | `bg-pink-100` | `text-pink-800` |
| Bills | `#ef4444` (red) | `bg-red-100` | `text-red-800` |
| Other | `#6b7280` (gray) | `bg-gray-100` | `text-gray-800` |

## State Management

| Location | Key / Mechanism | Data |
|----------|----------------|------|
| localStorage | `"expense-tracker-expenses"` | Full `Expense[]` array (JSON-serialized) |
| React state | `useLocalStorage` internal `useState` | In-memory copy of expenses |
| React memoization | `useMemo` in `DashboardPage` | Computed `ExpenseSummary` |

The dashboard is **read-only** — it does not modify expense data. All mutations happen through the Expense Management feature (`/expenses`).

## Known Limitations

- **No server-side rendering:** All components are `"use client"`, so there is no SSR/SSG benefit. The dashboard renders a loading skeleton until localStorage loads.
- **No date range filter:** Summary always covers all expenses (totals) and a fixed 30-day window (daily chart). There is no UI to adjust the time range.
- **No real-time updates:** If expenses change in another tab, the dashboard won't reflect those changes until a page reload.
- **Amount precision:** Amounts are stored in cents as integers, avoiding floating-point issues but requiring conversion at every display boundary.
- **Chart library dependency:** Recharts is used for both charts. The Tooltip formatter uses `any` casts (with eslint-disable comments) to satisfy Recharts' typing.
- **Hardcoded categories:** The category list is static in `constants.ts`. Adding a new category requires a code change.

## Related Documentation

- [User Guide](../user/how-to-dashboard.md)
- [`code-analysis.md`](../../code-analysis.md) — Technical analysis of the codebase
- [`my-evaluation-template.md`](../../my-evaluation-template.md) — Feature evaluation framework
