"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useExpenses } from "@/hooks/useExpenses";
import { formatCurrency } from "@/lib/formatters";

interface VendorData {
  name: string;
  totalAmount: number;
  expenseCount: number;
  topCategory: string;
}

function aggregateVendors(
  expenses: { amount: number; description: string; category: string }[]
): VendorData[] {
  const vendorMap = new Map<
    string,
    {
      name: string;
      totalAmount: number;
      expenseCount: number;
      categoryCounts: Map<string, number>;
    }
  >();

  for (const expense of expenses) {
    const key = expense.description.toLowerCase().trim();
    const existing = vendorMap.get(key);

    if (existing) {
      existing.totalAmount += expense.amount;
      existing.expenseCount += 1;
      existing.categoryCounts.set(
        expense.category,
        (existing.categoryCounts.get(expense.category) || 0) + 1
      );
    } else {
      const categoryCounts = new Map<string, number>();
      categoryCounts.set(expense.category, 1);
      vendorMap.set(key, {
        name: expense.description.trim(),
        totalAmount: expense.amount,
        expenseCount: 1,
        categoryCounts,
      });
    }
  }

  const vendors: VendorData[] = Array.from(vendorMap.values()).map((entry) => {
    let topCategory = "";
    let topCount = 0;
    Array.from(entry.categoryCounts.entries()).forEach(([category, count]) => {
      if (count > topCount) {
        topCount = count;
        topCategory = category;
      }
    });
    return {
      name: entry.name,
      totalAmount: entry.totalAmount,
      expenseCount: entry.expenseCount,
      topCategory,
    };
  });

  vendors.sort((a, b) => b.totalAmount - a.totalAmount);
  return vendors;
}

export default function TopVendorsPage() {
  const { expenses, isLoaded } = useExpenses();
  const vendors = useMemo(() => aggregateVendors(expenses), [expenses]);

  if (!isLoaded) {
    return (
      <div>
        <Header title="Top Vendors" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Top Vendors">
        <Link href="/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </Header>

      {vendors.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No vendors yet</p>
              <p className="text-gray-400 mt-1">
                Add some expenses to see your top vendors here.
              </p>
              <Link href="/expenses/new" className="inline-block mt-4">
                <Button>Add Your First Expense</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Vendors by Total Spending
              </h2>
              <span className="text-sm text-gray-500">
                {vendors.length} vendor{vendors.length !== 1 ? "s" : ""}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {vendors.map((vendor, index) => (
                <div
                  key={vendor.name}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {vendor.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {vendor.expenseCount} expense
                      {vendor.expenseCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge category={vendor.topCategory} />
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(vendor.totalAmount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
