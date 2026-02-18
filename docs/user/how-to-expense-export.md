# How to Export Your Expenses

> Last updated: 2026-02-18

## What is Expense Export?

Expense Export lets you download all your tracked expenses as a CSV file that you can open in Excel, Google Sheets, or any spreadsheet application.

## Getting There

1. Open the app in your browser
2. Navigate to the **Dashboard** page (this is the default home page)
3. Look for the **"Export Data"** button in the top-right area of the page, next to "Add Expense"

![Navigating to Export](../screenshots/expense-export-navigation.png)
<!-- TODO: Capture screenshot of navigation path -->

## Quick Start

1. Go to the **Dashboard**
2. Click the **"Export Data"** button
3. A CSV file named `expenses-YYYY-MM-DD.csv` will download automatically

![Quick start overview](../screenshots/expense-export-overview.png)
<!-- TODO: Capture screenshot of the main feature view -->

## Step-by-Step Guide

### Exporting Your Expenses

1. Make sure you have at least one expense added to the tracker. The "Export Data" button will be grayed out if you have no expenses.
2. From the **Dashboard**, locate the **"Export Data"** button in the header area. It appears with a white/gray style next to the blue "Add Expense" button.
3. Click **"Export Data"**.
4. Your browser will immediately download a file named something like `expenses-2026-02-18.csv` (the date in the filename is today's date).
5. Open the downloaded file with your preferred spreadsheet application.

![Exporting expenses](../screenshots/expense-export-download.png)
<!-- TODO: Capture screenshot showing the Export Data button -->

### Understanding the CSV File

The exported file contains four columns:

| Column | Description | Example |
|--------|-------------|---------|
| **Date** | The date of the expense | Jan 15, 2026 |
| **Category** | The category you assigned | Food |
| **Amount** | The dollar amount | 12.50 |
| **Description** | Your description of the expense | "Lunch at cafe" |

Expenses are sorted by date, from oldest to newest.

![CSV file contents](../screenshots/expense-export-csv-contents.png)
<!-- TODO: Capture screenshot showing the CSV opened in a spreadsheet -->

### Opening in Excel

1. Locate the downloaded `.csv` file in your Downloads folder
2. Double-click the file to open it in Excel
3. The data will appear in columns A through D

### Opening in Google Sheets

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **File > Import**
3. Select the **Upload** tab
4. Drag and drop your downloaded CSV file, or click "Browse" to find it
5. Choose **"Replace spreadsheet"** or **"Insert new sheet"**
6. Click **Import data**

## Tips

- The export includes **all** of your expenses, not just what you see on the dashboard charts
- The filename includes today's date, so you can easily keep track of when you exported
- You can use the exported CSV to create your own custom charts or analysis in a spreadsheet
- If you want to back up your data, exporting regularly is a good habit

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Export Data" button is grayed out | You have no expenses to export. Add at least one expense first. |
| File doesn't download | Check that your browser isn't blocking downloads. Look for a download notification in your browser's toolbar. |
| CSV looks garbled in Excel | Try importing the file instead of opening directly: In Excel, go to Data > From Text/CSV and select the file. |
| Special characters look wrong | The file uses UTF-8 encoding. When importing, make sure to select UTF-8 as the character encoding. |

## Related

- [Technical Documentation](../dev/expense-export-implementation.md)
