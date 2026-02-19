Analyze the expense-tracker codebase and suggest improvements ranked by impact vs effort.

Focus on: $ARGUMENTS

If a specific area is provided above, focus there. If blank, analyze the entire application.

Valid focus areas: `dashboard`, `expenses`, `insights`, `filters`, `top-categories`, `top-vendors`, `form`

## Analysis Steps

1. Read all relevant page and component files. Document current capabilities and limitations.
2. Identify UX gaps: missing feedback states, sorting, search, export/import, bulk actions, empty states.
3. Find edge cases: corrupted localStorage, unknown categories, boundary values, cross-tab sync, zero-data states.
4. Check performance: redundant JSON parsing, unmemoized analytics, bundle size, list rendering.
5. Suggest data visualization enhancements: new chart types, trend analysis, cross-feature linking (e.g., click pie chart to filter).

## Output

Produce the report directly in the conversation (do NOT create any files). Organize suggestions into:
- **Quick Wins** (< 1 hour) — table with impact/effort, brief descriptions
- **Strategic Improvements** (1-4 hours) — table with implementation approach
- **Nice-to-Haves** (< 1 day) and **Larger Initiatives** (multi-day)
- **Edge Cases** table with current behavior and suggested fix
- **Impact/Effort Matrix** placing each suggestion

## Rules

- Only analyze what actually exists in the code — read files before making claims
- Every suggestion must reference specific files or components it would affect
- Do not suggest adding a backend, database, authentication, or switching frameworks
- Effort estimates should account for this being a client-side-only Next.js + localStorage app
