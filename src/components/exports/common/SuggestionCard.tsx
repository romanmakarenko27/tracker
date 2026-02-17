"use client";

import { ExportSuggestion } from "@/types/export";
import { Button } from "@/components/ui/Button";

interface SuggestionCardProps {
  suggestion: ExportSuggestion;
  onAction: (suggestion: ExportSuggestion) => void;
}

const iconMap: Record<string, JSX.Element> = {
  clock: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  file: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  cloud: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  share: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  template: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
};

const priorityColors: Record<string, string> = {
  high: "border-l-primary-500",
  medium: "border-l-amber-500",
  low: "border-l-gray-300",
};

export function SuggestionCard({ suggestion, onAction }: SuggestionCardProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 border-l-4 ${priorityColors[suggestion.priority]} p-4 animate-float-up`}
    >
      <div className="flex items-start gap-3">
        <div className="text-primary-600 mt-0.5">
          {iconMap[suggestion.icon] || iconMap.file}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">{suggestion.title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{suggestion.description}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => onAction(suggestion)}>
          {suggestion.actionLabel}
        </Button>
      </div>
    </div>
  );
}
