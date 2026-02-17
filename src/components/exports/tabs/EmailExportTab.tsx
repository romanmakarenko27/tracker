"use client";

import { useState } from "react";
import { Expense } from "@/types/expense";
import { useExportConfig } from "@/hooks/useExportConfig";
import { useExportHistory } from "@/hooks/useExportHistory";
import { simulateEmailSend } from "@/lib/export-simulation";
import { FORMAT_OPTIONS } from "@/lib/export-constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AnimatedProgress } from "../common/AnimatedProgress";
import toast from "react-hot-toast";

interface EmailExportTabProps {
  expenses: Expense[];
}

type Phase = "config" | "sending" | "sent";

export function EmailExportTab({ expenses }: EmailExportTabProps) {
  const config = useExportConfig(expenses);
  const { addEntry } = useExportHistory();
  const [phase, setPhase] = useState<Phase>("config");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Expense Report");

  const handleSend = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setPhase("sending");
    const start = Date.now();

    try {
      await simulateEmailSend();
      const duration = Date.now() - start;

      addEntry({
        format: config.format,
        destination: "email",
        filename: `${config.filename}.${config.format}`,
        recordCount: config.filteredExpenses.length,
        categories: config.selectedCategories,
        dateRange:
          config.dateFrom || config.dateTo
            ? { from: config.dateFrom, to: config.dateTo }
            : null,
        duration,
      });

      setPhase("sent");
      toast.success(`Report sent to ${email}`);
    } catch {
      setPhase("config");
      toast.error("Failed to send email");
    }
  };

  const handleReset = () => {
    setPhase("config");
    setEmail("");
    setSubject("Expense Report");
    config.resetConfig();
  };

  // Phase: Sending animation
  if (phase === "sending") {
    return (
      <div className="animate-float-up flex flex-col items-center justify-center py-16">
        <div className="animate-envelope-fly mb-8">
          <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sending your report...</h3>
        <p className="text-sm text-gray-500 mb-6">
          Delivering to {email}
        </p>
        <div className="w-64">
          <AnimatedProgress isActive={true} duration={2500} label="Sending email..." />
        </div>
      </div>
    );
  }

  // Phase: Sent confirmation
  if (phase === "sent") {
    return (
      <div className="animate-float-up flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600 animate-check-draw" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Sent!</h3>
        <p className="text-sm text-gray-500 mb-2">
          Report delivered to <span className="font-medium text-gray-700">{email}</span>
        </p>
        <p className="text-xs text-gray-400 mb-6">
          {config.filteredExpenses.length} records as {config.format.toUpperCase()}
        </p>
        <Button variant="secondary" onClick={handleReset}>
          Send Another
        </Button>
      </div>
    );
  }

  // Phase: Config
  return (
    <div className="animate-float-up space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Email Settings</h3>
        <div className="space-y-4">
          <Input
            label="Recipient Email"
            type="email"
            placeholder="colleague@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Subject"
            placeholder="Expense Report"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Attachment Format</label>
        <div className="flex gap-2">
          {FORMAT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => config.setFormat(opt.value)}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                config.format === opt.value
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              {config.filteredExpenses.length} record(s) attached
            </p>
            <p className="text-xs text-gray-500">
              {config.filename}.{config.format}
            </p>
          </div>
          <Button
            onClick={handleSend}
            disabled={!email.trim() || config.filteredExpenses.length === 0}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Email
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
