# Expense Tracker

Personal expense tracking app built with Next.js (App Router).

## Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Storage:** Browser localStorage (no backend/database)
- **Utilities:** date-fns, uuid, react-hot-toast

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    dashboard/page.tsx    # Dashboard with charts and summary
    expenses/page.tsx     # Expense list with filters
    expenses/new/page.tsx # Add new expense
    expenses/[id]/edit/   # Edit existing expense
  components/
    ui/                   # Reusable UI primitives (Button, Input, Select, Card, Badge, Modal)
    layout/               # Sidebar, MobileNav, Header
    dashboard/            # SummaryCards, SpendingByCategory, SpendingOverTime, RecentExpenses
    expenses/             # ExpenseForm, ExpenseList, ExpenseListItem, ExpenseFilters, DeleteConfirmModal
    providers/            # ToastProvider
  hooks/                  # useLocalStorage, useExpenses, useExpenseFilters
  lib/                    # constants, formatters, validators, analytics, exportCsv
  types/                  # TypeScript interfaces (Expense, ExpenseFormData, ExpenseFilters, ExpenseSummary)
```

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Key Conventions

- **Path alias:** `@/*` maps to `./src/*`
- **Money values:** Stored in cents internally, displayed as dollars
- **Dates:** Stored as `YYYY-MM-DD` strings
- **Categories:** Defined in `src/lib/constants.ts` (Food, Transportation, Entertainment, Shopping, Bills, Other)
- **All components** are client-side (`"use client"`) since the app uses localStorage for data persistence
- **ESLint config:** Extends `next/core-web-vitals` and `next/typescript`
