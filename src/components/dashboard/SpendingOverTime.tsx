"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { formatCurrency, formatDateShort } from "@/lib/formatters";

interface SpendingOverTimeProps {
  dailyTotals: { date: string; total: number }[];
}

export function SpendingOverTime({ dailyTotals }: SpendingOverTimeProps) {
  const hasData = dailyTotals.some((d) => d.total > 0);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-gray-900">Spending Over Time</h2>
        <p className="text-sm text-gray-500">Last 30 days</p>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-64 flex items-center justify-center text-sm text-gray-500">
            No data to display
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTotals}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDateShort}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  interval="preserveStartEnd"
                  tickCount={6}
                />
                <YAxis
                  tickFormatter={(v) => formatCurrency(v)}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  width={70}
                />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={((value: any) => [formatCurrency(Number(value)), "Spent"]) as any}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  labelFormatter={((label: any) => formatDateShort(String(label))) as any}
                  contentStyle={{ borderRadius: "0.75rem", fontSize: "0.875rem" }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
