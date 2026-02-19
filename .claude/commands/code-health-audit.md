Analyze the expense-tracker codebase and produce a structured health report.

Focus area: $ARGUMENTS

If a focus area is provided above, run only that check. If blank, run all checks.

Valid focus areas: `dependencies`, `types`, `imports`, `complexity`, `dead-code`, `duplication`, `all`

## Audit Steps

1. **Dependencies** — Check `package.json` vs actual imports in `src/`. Flag extraneous, unlisted, or outdated packages.
2. **Imports** — Verify all project imports use `@/*` alias. Detect circular imports and unused imports.
3. **Type Safety** — Find `: any`, `as any`, type assertions, and non-null assertions. Note if justified (e.g., Recharts).
4. **Complexity** — Flag files over 150 LOC and functions over 30 lines. Note deep nesting (3+ levels).
5. **Dead Code** — Check every export in `lib/`, `hooks/`, `types/`, `components/ui/` for consumers. Flag zero-consumer exports.
6. **Duplication** — Find repeated patterns: nav item arrays, category mappings outside constants, duplicated formatting logic.

## Output

Produce the report directly in the conversation (do NOT create any files). Include:
- Health score table (A-F per area)
- Detailed findings with `file:line` references
- Top 5 recommendations
- Quick wins (fixable in under 5 minutes)

## Rules

- Only report what you actually find in the code — never fabricate issues
- Include `file:line` references for every finding
- Grade each area: A (no issues), B (minor), C (moderate), D (significant), F (critical)
- Recharts `any` assertions are expected — note them but don't count against type safety score
