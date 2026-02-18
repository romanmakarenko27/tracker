# Expense Export — Developer Documentation

> Auto-generated on 2026-02-18. Source of truth is the code itself; update this doc when the implementation changes.

## Overview

The Expense Export feature allows users to download all their tracked expenses as a CSV file directly from the dashboard. It converts in-memory expense data (sourced from localStorage) into a formatted CSV with date, category, amount, and description columns, and triggers a browser file download.

**Feature type:** Frontend-only

## Architecture

### File Map

| File | Role | Lines |
|------|------|-------|
| `src/lib/exportCsv.ts` | Core export logic — builds CSV string and triggers download | ~25 |
| `src/app/dashboard/page.tsx` | Dashboard page — hosts the "Export Data" button | ~44 |
| `src/types/expense.ts` | `Expense` type definition consumed by the export function | ~31 |
| `src/lib/formatters.ts` | `centsToDollars` and `formatDate` helpers used during CSV generation | ~32 |
| `src/hooks/useExpenses.ts` | `useExpenses` hook — provides the expense array passed to the export function | ~77 |
| `src/hooks/useLocalStorage.ts` | Underlying storage hook — persists/retrieves expenses from localStorage | ~39 |
| `src/components/ui/Button.tsx` | Reusable `Button` component — renders the "Export Data" button | ~37 |
| `src/components/layout/Header.tsx` | `Header` layout component — contains the export button in the actions area | ~15 |

### Dependency Graph

```
DashboardPage (src/app/dashboard/page.tsx)
├── useExpenses (src/hooks/useExpenses.ts)
│   ├── useLocalStorage (src/hooks/useLocalStorage.ts)
│   ├── Expense type (src/types/expense.ts)
│   └── dollarsToCents (src/lib/formatters.ts)
├── exportExpensesToCsv (src/lib/exportCsv.ts)
│   ├── Expense type (src/types/expense.ts)
│   ├── centsToDollars (src/lib/formatters.ts)
│   └── formatDate (src/lib/formatters.ts)
├── Header (src/components/layout/Header.tsx)
└── Button (src/components/ui/Button.tsx)
```

### Data Flow

```
User clicks "Export Data" button
  → onClick handler calls exportExpensesToCsv(expenses)
    → expenses array (from useExpenses → localStorage) is received
    → expenses are sorted by date ascending
    → each expense is mapped to a CSV row:
        date → formatDate()          (e.g. "Jan 15, 2026")
        category → raw string       (e.g. "Food")
        amount → centsToDollars()    (e.g. "12.50")
        description → double-quote escaped
    → CSV string is built (headers + rows joined by newlines)
    → Blob created with MIME type text/csv
    → Object URL created from Blob
    → Temporary <a> element created, click() triggered
    → File download starts (expenses-YYYY-MM-DD.csv)
    → Object URL revoked to free memory
```

## Type Definitions

### Expense

```ts
// src/types/expense.ts
export interface Expense {
  id: string;
  amount: number;       // stored in cents (e.g. 1250 = $12.50)
  category: string;     // one of the CATEGORIES names
  description: string;  // free-text user input
  date: string;         // ISO date format YYYY-MM-DD
  createdAt: string;    // full ISO timestamp
  updatedAt: string;    // full ISO timestamp
}
```

Only `date`, `category`, `amount`, and `description` are included in the CSV output. The `id`, `createdAt`, and `updatedAt` fields are excluded.

## Components

### DashboardPage

- **File:** `src/app/dashboard/page.tsx`
- **Props:** None (Next.js page component)
- **State:**
  - `expenses` and `isLoaded` — from `useExpenses()` hook
  - `summary` — memoized result of `calculateSummary(expenses)`
- **Key behavior:**
  - Renders an "Export Data" button in the `Header` actions area
  - Button uses `variant="secondary"` styling
  - Button is disabled when `expenses.length === 0` (nothing to export)
  - On click, calls `exportExpensesToCsv(expenses)` with the full unfiltered expense array

### Header

- **File:** `src/components/layout/Header.tsx`
- **Props:**

  | Prop | Type | Required | Description |
  |------|------|----------|-------------|
  | `title` | `string` | Yes | Page title displayed as h1 |
  | `children` | `React.ReactNode` | No | Action buttons rendered in the header row |

- **Key behavior:** Renders a flex container with the title and optional action children (where the export button lives)

### Button

- **File:** `src/components/ui/Button.tsx`
- **Props:**

  | Prop | Type | Required | Description |
  |------|------|----------|-------------|
  | `variant` | `"primary" \| "secondary" \| "danger" \| "ghost"` | No | Visual style (default: `"primary"`) |
  | `size` | `"sm" \| "md" \| "lg"` | No | Size variant (default: `"md"`) |
  | `className` | `string` | No | Additional CSS classes |
  | `...props` | `ButtonHTMLAttributes` | No | All native button attributes (disabled, onClick, etc.) |

- **Key behavior:** The export button uses `variant="secondary"` and the `disabled` prop when there are no expenses

## Utility Functions

### exportExpensesToCsv

- **File:** `src/lib/exportCsv.ts`
- **Signature:** `exportExpensesToCsv(expenses: Expense[]): void`
- **Purpose:** Converts an array of expenses into a CSV file and triggers a browser download
- **Algorithm:**
  1. Defines headers: `["Date", "Category", "Amount", "Description"]`
  2. Sorts expenses by `date` ascending (lexicographic `localeCompare`)
  3. Maps each expense to a row array using `formatDate`, raw category, `centsToDollars`, and escaped description
  4. Joins headers and rows with commas and newlines
  5. Creates a `Blob` → `URL.createObjectURL` → programmatic `<a>` click → `URL.revokeObjectURL`
- **Output filename:** `expenses-YYYY-MM-DD.csv` (based on current date)
- **Edge cases:**
  - Descriptions containing double quotes are escaped by doubling (`"` → `""`) and the entire field is wrapped in quotes
  - Amounts are converted from cents to dollars with 2 decimal places (e.g. `1250` → `"12.50"`)
  - Empty expense array: the button is disabled in the UI, but the function itself would produce a headers-only CSV if called directly

### centsToDollars

- **File:** `src/lib/formatters.ts`
- **Signature:** `centsToDollars(cents: number): string`
- **Purpose:** Converts cents integer to dollar string with 2 decimal places
- **Example:** `centsToDollars(1250)` → `"12.50"`

### formatDate

- **File:** `src/lib/formatters.ts`
- **Signature:** `formatDate(dateStr: string): string`
- **Purpose:** Formats an ISO date string (`YYYY-MM-DD`) into a human-readable format
- **Example:** `formatDate("2026-01-15")` → `"Jan 15, 2026"`
- **Dependency:** Uses `date-fns` `format` and `parseISO`

## Constants & Configuration

| Constant | File | Value | Purpose |
|----------|------|-------|---------|
| `STORAGE_KEY` | `src/lib/constants.ts` | `"expense-tracker-expenses"` | localStorage key where expenses are persisted |
| CSV Headers | `src/lib/exportCsv.ts` | `["Date", "Category", "Amount", "Description"]` | Column headers in exported CSV |
| CSV MIME type | `src/lib/exportCsv.ts` | `"text/csv;charset=utf-8;"` | Blob MIME type for the download |

## State Management

- **Expense data source:** localStorage under key `"expense-tracker-expenses"`
- **State flow:** `useLocalStorage` → `useExpenses` → `DashboardPage` → `exportExpensesToCsv`
- **No server-side state:** This is entirely a client-side feature. No API calls are made.
- **No export-specific state:** The export is a fire-and-forget action — no loading states, progress tracking, or export history is maintained.

## Known Limitations

- **No filtering before export:** The export button on the dashboard exports ALL expenses, ignoring any active filters (the dashboard page does not use filters). Users cannot export a subset.
- **No format options:** Only CSV is supported. No JSON, Excel, or PDF export.
- **No export from the Expenses list page:** The export button only exists on the dashboard, not on `/expenses` where filters are available.
- **Date column uses formatted dates:** The CSV date column uses `"MMM d, yyyy"` format (e.g. "Jan 15, 2026") rather than ISO `YYYY-MM-DD`, which may complicate re-import or programmatic parsing.
- **Category and Amount columns are not quoted:** Only the description column is quoted in the CSV output. If a category name contained a comma, it would break the CSV structure (currently not possible with the hardcoded category list).
- **No BOM for Excel compatibility:** The CSV does not include a UTF-8 BOM, which may cause encoding issues when opening in Excel with non-ASCII characters.
- **Browser-only:** Uses `document.createElement` and `URL.createObjectURL` — will not work in SSR or Node.js environments.

## Related Documentation

- [User Guide](../user/how-to-expense-export.md)
