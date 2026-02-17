"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { getCategoryData } from "@/lib/analytics";
import { getCategoryDef } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";

interface SpendingByCategoryProps {
  categoryTotals: Record<string, number>;
}

export function SpendingByCategory({ categoryTotals }: SpendingByCategoryProps) {
  const data = getCategoryData(categoryTotals);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-gray-900">Spending by Category</h2>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-sm text-gray-500">
            No data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-gray-900">Spending by Category</h2>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={getCategoryDef(entry.name).color} />
                ))}
              </Pie>
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((value: any) => formatCurrency(Number(value))) as any}
                contentStyle={{ borderRadius: "0.75rem", fontSize: "0.875rem" }}
              />
              <Legend
                formatter={(value: string) => (
                  <span className="text-sm text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
