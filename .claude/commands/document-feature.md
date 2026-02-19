# Document Feature

Generate developer and user documentation for a feature in this project.

## Input

Feature name: $ARGUMENTS

## Instructions

You are a documentation generator for this Next.js expense-tracker project. Given the feature name above, perform the following steps:

### Step 1: Discover Feature Files

Search the codebase for all files related to the feature name. Look in:
- `src/components/` — React components
- `src/hooks/` — Custom hooks
- `src/lib/` — Utility/logic files
- `src/types/` — TypeScript type definitions
- `src/app/` — Next.js pages/routes

Use Glob patterns like `**/*{feature-name}*` and Grep for the feature name across the codebase. Also search for related imports and references to build the full dependency graph.

### Step 2: Detect Feature Type

Based on the files found, classify the feature:
- **Frontend-only**: Components, hooks, client-side logic only (no API routes)
- **Backend-only**: API routes, server actions only (no components)
- **Full-stack**: Both API routes/server logic AND UI components

This classification affects what sections appear in each doc.

### Step 3: Find Related Documentation

Search for existing documentation that should be cross-referenced:
- Check `docs/` directory for any existing docs
- Check `README.md` for relevant sections
- Check `code-analysis.md` for technical analysis
- Check `my-evaluation-template.md` for evaluation criteria
- Note any related features that share components or utilities

### Step 4: Analyze the Code

For every file discovered in Step 1, read it fully. Extract:
- **Types/Interfaces**: All exported TypeScript types and their shapes
- **Components**: Props, state, effects, event handlers, rendered UI structure
- **Hooks**: Parameters, return values, internal state, side effects
- **Utilities**: Function signatures, parameters, return types, algorithms
- **Constants**: Exported config values, enums, magic strings
- **Routes/Pages**: URL path, query params, layout structure

### Step 5: Generate Developer Documentation

Create the file `docs/dev/{feature-name}-implementation.md` with this structure:

```markdown
# {Feature Name} — Developer Documentation

> Auto-generated on {today's date}. Source of truth is the code itself; update this doc when the implementation changes.

## Overview

{2-3 sentence summary of what this feature does and its role in the application}

**Feature type:** {Frontend-only | Backend-only | Full-stack}

## Architecture

### File Map

| File | Role | Lines |
|------|------|-------|
| `src/...` | {brief role} | {approx line count} |

### Dependency Graph

{Show which files import from which, as a text diagram or bullet list}

### Data Flow

{Describe how data moves through the feature: user action → component → hook → util → storage/API → back to UI}

## Type Definitions

{For each type/interface, show the full definition with inline comments explaining non-obvious fields}

## Components

### {ComponentName}

- **File:** `src/components/.../ComponentName.tsx`
- **Props:** {table of prop name, type, required, description}
- **State:** {list of useState/useReducer with purpose}
- **Key behavior:** {bullet points of what it does}

{Repeat for each component}

## Hooks

### {useHookName}

- **File:** `src/hooks/useHookName.ts`
- **Parameters:** {list}
- **Returns:** {describe return shape}
- **Side effects:** {localStorage, API calls, timers, etc.}
- **Usage example:**
```ts
const { ... } = useHookName(...);
```

{Repeat for each hook}

## Utility Functions

### {functionName}

- **File:** `src/lib/filename.ts`
- **Signature:** `functionName(param: Type): ReturnType`
- **Purpose:** {what it does}
- **Edge cases:** {notable behavior}

{Repeat for each utility}

## Constants & Configuration

{Table of exported constants with their values and purpose}

## State Management

{Describe where state lives: localStorage keys, React state, URL params, etc.}

## Known Limitations

{List any TODOs, simulated features, missing error handling, security concerns found in the code}

## Related Documentation

- [User Guide](../user/how-to-{feature-name}.md)
{- Links to any other related docs found in Step 3}
```

### Step 6: Generate User Documentation

Create the file `docs/user/how-to-{feature-name}.md` with this structure:

```markdown
# How to {Feature Name in Plain English}

> Last updated: {today's date}

## What is {Feature Name}?

{1-2 sentence plain-English explanation of what this feature lets the user do}

## Getting There

{How to navigate to the feature in the app}

1. {Step to reach the feature}
2. {Step}

![Navigating to {feature}](../screenshots/{feature-name}-navigation.png)
<!-- TODO: Capture screenshot of navigation path -->

## Quick Start

{Shortest path to use the feature successfully}

1. {First step}
2. {Second step}
3. {etc.}

![Quick start overview](../screenshots/{feature-name}-overview.png)
<!-- TODO: Capture screenshot of the main feature view -->

## Step-by-Step Guide

### {First Major Action}

1. {Detailed step}
2. {Detailed step}

![{Description}](../screenshots/{feature-name}-{action}.png)
<!-- TODO: Capture screenshot showing this step -->

{Repeat for each major user action the feature supports}

### {Second Major Action}

1. {Detailed step}
2. {Detailed step}

![{Description}](../screenshots/{feature-name}-{action2}.png)
<!-- TODO: Capture screenshot showing this step -->

## Options & Settings

{If the feature has configurable options, list them in a table}

| Option | What it does | Default |
|--------|-------------|---------|
| {name} | {description} | {value} |

## Tips

- {Practical tip for getting the most out of the feature}
- {Another tip}

## Troubleshooting

| Problem | Solution |
|---------|----------|
| {Common issue} | {How to fix it} |

## Related

- [Technical Documentation](../dev/{feature-name}-implementation.md)
{- Links to related user guides for connected features}
```

### Step 7: Create Screenshot Directory

Ensure the directory `docs/screenshots/` exists. Create a placeholder file `docs/screenshots/.gitkeep` if the directory doesn't exist yet.

### Step 8: Summary

After generating both files, output a summary:

```
Documentation generated:
  - docs/dev/{feature-name}-implementation.md    (Developer)
  - docs/user/how-to-{feature-name}.md           (User Guide)
  - docs/screenshots/                             (Screenshot placeholders)

Feature type detected: {type}
Files analyzed: {count}
Screenshot placeholders: {count} (search for "TODO: Capture" to find them)
Cross-references: linked between dev and user docs
```

## Rules

- Use the ACTUAL code you read to fill in the documentation — never invent APIs or behaviors that don't exist in the source.
- Convert kebab-case feature names to readable titles (e.g., `expense-export` → "Expense Export").
- If a feature has sub-features (like export has "quick export", "templates", "history"), create sections for each in both docs.
- Keep developer docs precise and technical. Keep user docs friendly and jargon-free.
- Always include the cross-reference links between the two doc types.
- Every distinct user-facing screen or interaction should get a screenshot placeholder in the user doc.
- If existing docs are found in Step 3, add cross-links to them in both generated docs.
