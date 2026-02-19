Audit the expense-tracker codebase for WCAG 2.1 AA compliance.

Focus on: $ARGUMENTS

If a specific component or page is provided above, limit your review to that area. If blank, audit the entire application.

## Audit Steps

1. Read all relevant component and page files
2. Check every interactive element for: proper labels, ARIA attributes, focus styles, keyboard support
3. Check semantic HTML: heading hierarchy, landmarks (`<main>`, `<nav>`), form labels, error associations
4. Check keyboard navigation: tab order, focus traps in modals, Escape to close, skip links
5. Check color contrast and color-only information (especially charts and category indicators)
6. Check touch targets meet 44x44px minimum on mobile
7. Check screen reader experience: toast announcements, icon-only button labels, page titles, loading states

## Output

Produce the report directly in the conversation (do NOT create any files). For each issue include:
- Severity (Critical / Serious / Moderate / Minor)
- WCAG criterion
- `file:line` location
- Before/after code fix

End with a component scorecard (A-F grades) and prioritized fix order.

## Rules

- Only report what you actually find in the code — never fabricate issues
- Include `file:line` references for every finding
- Provide concrete code fix snippets
- Recharts `any` assertions and react-hot-toast ARIA handling may be acceptable — verify before flagging
