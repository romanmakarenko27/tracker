import { ExportAnalytics, ExportSuggestion } from "@/types/export";

export function generateSuggestions(analytics: ExportAnalytics): ExportSuggestion[] {
  const suggestions: ExportSuggestion[] = [];

  // Suggest setting up a schedule if none detected
  if (analytics.totalExports > 3 && analytics.exportStreak < 2) {
    suggestions.push({
      id: "schedule-setup",
      type: "schedule",
      title: "Set Up Auto-Export",
      description:
        "You export regularly. Save time by setting up an automated export schedule.",
      icon: "clock",
      priority: "high",
      actionLabel: "Create Schedule",
    });
  }

  // Suggest trying a different format
  if (analytics.totalExports > 2 && Object.keys(analytics.exportsByFormat).length < 3) {
    const unused = (["csv", "json", "pdf"] as const).find(
      (f) => !analytics.exportsByFormat[f]
    );
    if (unused) {
      suggestions.push({
        id: "try-format",
        type: "format",
        title: `Try ${unused.toUpperCase()} Format`,
        description: `You haven't tried exporting as ${unused.toUpperCase()} yet. It might be useful for your needs.`,
        icon: "file",
        priority: "low",
        actionLabel: "Try It",
      });
    }
  }

  // Suggest cloud backup
  if (analytics.totalExports > 5 && !analytics.exportsByDestination["dropbox"] && !analytics.exportsByDestination["onedrive"] && !analytics.exportsByDestination["google-drive"]) {
    suggestions.push({
      id: "cloud-backup",
      type: "backup",
      title: "Back Up to Cloud",
      description:
        "Keep your exports safe by connecting a cloud storage provider for automatic backups.",
      icon: "cloud",
      priority: "medium",
      actionLabel: "Connect Cloud",
    });
  }

  // Suggest sharing
  if (analytics.totalExports > 3 && !analytics.exportsByDestination["email"]) {
    suggestions.push({
      id: "share-export",
      type: "share",
      title: "Share Your Reports",
      description:
        "Create shareable links to your exports for easy collaboration with team members.",
      icon: "share",
      priority: "low",
      actionLabel: "Create Link",
    });
  }

  // Suggest templates
  if (analytics.totalExports > 1 && analytics.averageRecordsPerExport > 0) {
    suggestions.push({
      id: "use-templates",
      type: "template",
      title: "Use Export Templates",
      description:
        "Pre-configured templates make recurring exports faster. Try one of our built-in templates.",
      icon: "template",
      priority: "medium",
      actionLabel: "View Templates",
    });
  }

  return suggestions.sort((a, b) => {
    const priority = { high: 0, medium: 1, low: 2 };
    return priority[a.priority] - priority[b.priority];
  });
}
