# How to Use the Dashboard

> Last updated: 2026-02-18

## What is the Dashboard?

The Dashboard gives you a quick overview of your spending. At a glance, you can see how much you've spent, what categories you spend the most on, and your recent expense activity.

## Getting There

The Dashboard is the home page of the app. You'll land here automatically when you open the application.

1. Open the app in your browser
2. You are on the Dashboard (it loads by default)

To return to the Dashboard from any other page, click **Dashboard** in the sidebar navigation.

![Navigating to Dashboard](../screenshots/dashboard-navigation.png)
<!-- TODO: Capture screenshot of sidebar with Dashboard link highlighted -->

## Quick Start

1. Open the app — the Dashboard loads automatically
2. Glance at the four summary cards at the top for key metrics
3. Review the two charts to see spending patterns
4. Check "Recent Expenses" at the bottom for your latest entries

![Quick start overview](../screenshots/dashboard-overview.png)
<!-- TODO: Capture screenshot of the full dashboard view -->

## Step-by-Step Guide

### Viewing Summary Metrics

The top of the Dashboard displays four cards showing your key financial metrics:

| Card | What It Shows |
|------|---------------|
| **Total Spent** | The sum of all your recorded expenses, in dollars |
| **Expenses** | The total number of expense entries |
| **Average** | The average amount per expense |
| **Top Category** | The category where you've spent the most |

These numbers update automatically whenever you add, edit, or delete an expense.

![Summary cards](../screenshots/dashboard-summary-cards.png)
<!-- TODO: Capture screenshot of the four summary metric cards -->

### Understanding Spending by Category

The **Spending by Category** chart (left side) is a donut chart that breaks down your total spending by category.

1. Look at the chart to see which categories take up the largest share of your spending
2. Hover over any slice to see the exact dollar amount
3. Use the legend below the chart to identify each category by color

Categories include: Food, Transportation, Entertainment, Shopping, Bills, and Other.

![Spending by category chart](../screenshots/dashboard-spending-by-category.png)
<!-- TODO: Capture screenshot of the pie/donut chart -->

### Viewing Spending Over Time

The **Spending Over Time** chart (right side) shows your daily spending over the last 30 days as an area chart.

1. Look at the trend line to spot spending peaks and quiet periods
2. Hover over any point on the chart to see the exact date and amount spent
3. Use this to identify patterns in your spending habits

![Spending over time chart](../screenshots/dashboard-spending-over-time.png)
<!-- TODO: Capture screenshot of the area chart -->

### Checking Recent Expenses

The **Recent Expenses** section at the bottom lists your 5 most recently added expenses.

1. See the description, category badge, date, and amount for each expense
2. Click **View All** in the top-right corner to go to the full expenses list

![Recent expenses list](../screenshots/dashboard-recent-expenses.png)
<!-- TODO: Capture screenshot of the recent expenses section -->

### Adding a New Expense

From the Dashboard, you can quickly navigate to add a new expense:

1. Click the **Add Expense** button in the top-right corner of the page
2. You'll be taken to the new expense form

![Add expense button](../screenshots/dashboard-add-expense.png)
<!-- TODO: Capture screenshot showing the Add Expense button in the header -->

### Accessing the Export Hub

To export your expense data:

1. Click the **Export Hub** button in the header (next to "Add Expense")
2. You'll be taken to the export page with multiple export options

![Export Hub button](../screenshots/dashboard-export-hub.png)
<!-- TODO: Capture screenshot showing the Export Hub button in the header -->

## Options & Settings

The Dashboard currently does not have configurable settings. It automatically shows:

| Aspect | Behavior |
|--------|----------|
| Summary metrics | Covers all expenses (no date filter) |
| Spending Over Time | Always shows the last 30 days |
| Recent Expenses | Always shows the 5 newest entries |
| Currency | Displayed in USD |

## Tips

- Check the Dashboard regularly after adding new expenses to see how your spending patterns change
- Pay attention to the "Top Category" card — if it's a category you want to reduce spending on, you can use that as motivation to cut back
- The "Spending Over Time" chart is great for spotting unusual spikes in your daily spending
- If the Dashboard shows "No data to display" in the charts, start by adding a few expenses to see your visualizations come to life
- Use the "View All" link in Recent Expenses to quickly jump to your full expense history

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Dashboard shows loading skeletons that never go away | Try refreshing the page. If the issue persists, check your browser's developer console for localStorage errors. |
| Charts show "No data to display" | You haven't added any expenses yet. Click "Add Expense" to get started. |
| The "Spending Over Time" chart is flat | You may only have expenses outside the 30-day window. Add recent expenses to see the chart populate. |
| Numbers seem wrong | Verify your expenses on the full expenses list (`/expenses`). The Dashboard sums all expenses without a date filter. |
| Dashboard doesn't reflect a recently added expense | Navigate away from the Dashboard and back, or refresh the page. |

## Related

- [Technical Documentation](../dev/dashboard-implementation.md)
