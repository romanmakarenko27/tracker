"use client";

import { useState } from "react";
import { ExportTabId } from "@/types/export";

export function useExportHub() {
  const [activeTab, setActiveTab] = useState<ExportTabId>("quick-export");

  return { activeTab, setActiveTab };
}
