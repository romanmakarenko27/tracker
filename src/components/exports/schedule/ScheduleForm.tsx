"use client";

import { useState } from "react";
import { ExportFormat, ExportDestination, ScheduleFrequency } from "@/types/export";
import { CATEGORY_NAMES } from "@/lib/constants";
import { SCHEDULE_FREQUENCIES, FORMAT_OPTIONS } from "@/lib/export-constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface ScheduleFormProps {
  onSubmit: (params: {
    name: string;
    frequency: ScheduleFrequency;
    format: ExportFormat;
    destination: ExportDestination;
    categories: string[];
    email?: string;
  }) => void;
  onCancel: () => void;
}

const DESTINATION_OPTIONS: { value: ExportDestination; label: string }[] = [
  { value: "download", label: "Download" },
  { value: "email", label: "Email" },
  { value: "dropbox", label: "Dropbox" },
  { value: "onedrive", label: "OneDrive" },
  { value: "google-drive", label: "Google Drive" },
];

export function ScheduleForm({ onSubmit, onCancel }: ScheduleFormProps) {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<ScheduleFrequency>("weekly");
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [destination, setDestination] = useState<ExportDestination>("download");
  const [email, setEmail] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...CATEGORY_NAMES]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      frequency,
      format,
      destination,
      categories: selectedCategories,
      email: destination === "email" ? email : undefined,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 animate-float-up">
      <h3 className="font-medium text-gray-900">New Schedule</h3>

      <Input
        label="Schedule Name"
        placeholder="e.g. Weekly expense report"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as ScheduleFrequency)}
          options={SCHEDULE_FREQUENCIES.map((f) => ({ value: f.value, label: f.label }))}
        />
        <Select
          label="Format"
          value={format}
          onChange={(e) => setFormat(e.target.value as ExportFormat)}
          options={FORMAT_OPTIONS.map((f) => ({ value: f.value, label: f.label }))}
        />
      </div>

      <Select
        label="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value as ExportDestination)}
        options={DESTINATION_OPTIONS}
      />

      {destination === "email" && (
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_NAMES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategories.includes(cat)
                  ? "bg-primary-100 text-primary-700 border border-primary-300"
                  : "bg-gray-100 text-gray-500 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
          disabled={!name.trim() || selectedCategories.length === 0}
        >
          Create Schedule
        </Button>
      </div>
    </div>
  );
}
