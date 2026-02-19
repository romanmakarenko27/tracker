# Expense Tracker

Personal expense tracking app built with Next.js App Router. Fully client-side — all data lives in browser localStorage with no backend or database.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 14.2.x |
| Language | TypeScript (strict mode) | 5.x |
| Styling | Tailwind CSS | 3.4.x |
| Charts | Recharts | 3.7.x |
| Dates | date-fns | 4.1.x |
| IDs | uuid (v4) | 13.x |
| Notifications | react-hot-toast | 2.6.x |

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
```

## Architecture

### Data Flow

```
localStorage ("expense-tracker-expenses")
        |
  useLocalStorage<T>          # Generic hook: read/write JSON, tracks isLoaded
        |
  useExpenses                  # CRUD operations, dollar-to-cent conversion
        |
  Page components              # Each page instantiates its own useExpenses
```

- **No shared state manager** (no Redux/Zustand). localStorage is the single source of truth.
- Every component using `useExpenses` gets its own hook instance reading from the same key.
- `isLoaded` flag prevents hydration mismatch — components render skeletons until localStorage is read.

### Rendering Model

All components use `"use client"`. There are no server components because the app depends entirely on browser localStorage. No SSR of data.

## Project Structure

```
src/
  app/
    page.tsx                    # / → redirects to /dashboard
    layout.tsx                  # Root layout: Sidebar + MobileNav + ToastProvider
    dashboard/page.tsx          # Summary cards, charts, recent expenses
    expenses/page.tsx           # Filterable expense list with delete
    expenses/new/page.tsx       # Create expense form
    expenses/[id]/edit/page.tsx # Edit expense form
    top-categories/page.tsx     # Category ranking by total spend
    top-vendors/page.tsx        # Vendor ranking (grouped by description)
    insights/page.tsx           # Monthly donut chart, top 3, budget streak
  components/
    ui/                         # Button, Input, Select, Card, Badge, Modal
    layout/                     # Sidebar (desktop), MobileNav (mobile), Header
    dashboard/                  # SummaryCards, SpendingByCategory, SpendingOverTime, RecentExpenses
    expenses/                   # ExpenseForm, ExpenseList, ExpenseListItem, ExpenseFilters, DeleteConfirmModal
    insights/                   # MonthlyInsights
    providers/                  # ToastProvider (react-hot-toast wrapper)
  hooks/
    useLocalStorage.ts          # Generic localStorage hook with isLoaded
    useExpenses.ts              # CRUD: addExpense, updateExpense, deleteExpense, getExpense
    useExpenseFilters.ts        # Filter state + memoized filtered results
  lib/
    constants.ts                # STORAGE_KEY, CATEGORIES (6 items), getCategoryDef()
    formatters.ts               # formatCurrency, dollarsToCents, centsToDollars, formatDate, todayISO
    validators.ts               # validateExpenseForm, hasErrors
    analytics.ts                # calculateSummary → ExpenseSummary (totals, averages, daily/category)
  types/
    expense.ts                  # Expense, ExpenseFormData, ExpenseFilters, ExpenseSummary
```

## Data Model

### Expense (stored)

```typescript
{
  id: string;          // UUID v4
  amount: number;      // Cents (integer). $12.34 → 1234
  category: string;    // One of: Food | Transportation | Entertainment | Shopping | Bills | Other
  description: string; // Free text, max 200 chars. Also used as "vendor" identifier
  date: string;        // "YYYY-MM-DD"
  createdAt: string;   // ISO timestamp (new Date().toISOString())
  updatedAt: string;   // ISO timestamp, refreshed on each edit
}
```

### ExpenseFormData (user input)

Same fields but `amount` is a **dollar string** (e.g. `"12.34"`). Converted to cents via `dollarsToCents()` before storage.

### Storage

- **Key:** `"expense-tracker-expenses"` (defined in `constants.ts`)
- **Format:** JSON array of `Expense` objects
- New expenses are **prepended** (newest first)

## Key Conventions

### Money

- **Internal:** Always cents (integer). Prevents floating-point errors.
- **Display:** `formatCurrency(cents)` → `"$12.34"` (Intl.NumberFormat USD)
- **Conversion:** `dollarsToCents("12.34")` → `1234`, `centsToDollars(1234)` → `"12.34"`
- **Max:** $999,999.99

### Dates

- **Storage:** `"YYYY-MM-DD"` strings
- **Display:** `formatDate()` → `"Feb 19, 2026"`, `formatDateShort()` → `"Feb 19"`
- **Today helper:** `todayISO()` → `"2026-02-19"`
- **No explicit timezone handling** — uses browser local timezone

### Categories

Six predefined in `src/lib/constants.ts`:

| Category | Chart Color | Tailwind |
|----------|------------|----------|
| Food | #f59e0b | amber |
| Transportation | #3b82f6 | blue |
| Entertainment | #8b5cf6 | violet |
| Shopping | #ec4899 | pink |
| Bills | #ef4444 | red |
| Other | #6b7280 | gray |

`getCategoryDef(name)` returns the definition or falls back to "Other".

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json). Always use `@/` imports.

## Routing

| Route | Page | Purpose |
|-------|------|---------|
| `/` | `page.tsx` | Redirect to `/dashboard` |
| `/dashboard` | `dashboard/page.tsx` | Summary cards, pie chart, area chart, recent list |
| `/expenses` | `expenses/page.tsx` | Full expense list with category/date filters |
| `/expenses/new` | `expenses/new/page.tsx` | Create form |
| `/expenses/[id]/edit` | `expenses/[id]/edit/page.tsx` | Edit form (shows 404 if not found) |
| `/top-categories` | `top-categories/page.tsx` | Categories ranked by total spend with % bars |
| `/top-vendors` | `top-vendors/page.tsx` | Vendors (descriptions) ranked by total spend |
| `/insights` | `insights/page.tsx` | Current month donut, top 3 categories, streak |

## Navigation

- **Desktop (md+):** Fixed left `Sidebar` — 6 items, active state via `usePathname()`
- **Mobile (<md):** Fixed bottom `MobileNav` — same 6 items with shorter labels
- Breakpoint: `md` (768px)

## Validation

Defined in `src/lib/validators.ts`. Applied on form submit in `ExpenseForm`.

| Field | Rules |
|-------|-------|
| Amount | Required, numeric, > 0, <= 999,999.99 |
| Category | Required, must be one of CATEGORY_NAMES |
| Description | Required, trimmed length 1–200 |
| Date | Required |

Errors display inline per field. Each field clears its own error on change.

## UI Patterns

- **Button variants:** `primary` (indigo), `secondary` (white/border), `danger` (red), `ghost` (transparent)
- **Loading states:** Skeleton placeholders with `animate-pulse` while `isLoaded === false`
- **Empty states:** Friendly messages with CTA to add first expense
- **Delete flow:** Click delete icon → `DeleteConfirmModal` → confirm → remove from localStorage
- **Toast notifications:** Success on create/edit, top-right position, 3s duration
- **Responsive grid:** Mobile-first, scales at `sm`/`md`/`lg` breakpoints
- **Custom primary color:** Indigo/violet palette (`#4f46e5` as primary-600)
- **Font:** Inter (Google Fonts)

## Guidelines for Changes

1. **Always `"use client"`** — every component needs it due to localStorage dependency
2. **Money in cents** — never store dollar floats. Convert at the boundary (form ↔ storage)
3. **Use existing UI primitives** — `Button`, `Input`, `Select`, `Card`, `Badge`, `Modal` in `components/ui/`
4. **Categories are centralized** — add/modify categories only in `constants.ts`
5. **Sorting** — expenses list sorts by `date` desc, then `createdAt` desc
6. **Analytics in `analytics.ts`** — keep calculation logic out of components
7. **Validation in `validators.ts`** — keep form validation separate from UI
8. **No backend** — all data operations go through `useExpenses` → `useLocalStorage` → `localStorage`
9. **Tailwind only** — no CSS modules or inline styles. Use the existing color palette
10. **Recharts quirk** — some `any` type assertions are necessary due to Recharts typing gaps (eslint-disable is acceptable there)
