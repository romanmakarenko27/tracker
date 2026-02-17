"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { Expense } from "@/types/expense";
import { CATEGORY_NAMES } from "@/lib/constants";
import { ExportFormat } from "@/types/export";
import {
  filterExpenses,
  generateDefaultFilename,
  executeExport,
} from "@/lib/export";

export function useExportConfig(expenses: Expense[]) {
  const [format, setFormatState] = useState<ExportFormat>("csv");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...CATEGORY_NAMES]);
  const [filename, setFilename] = useState(generateDefaultFilename());
  const [isExporting, setIsExporting] = useState(false);
  const userEditedFilename = useRef(false);

  const setFormat = useCallback((f: ExportFormat) => {
    setFormatState(f);
    if (!userEditedFilename.current) {
      setFilename(generateDefaultFilename());
    }
  }, []);

  const setCustomFilename = useCallback((name: string) => {
    userEditedFilename.current = true;
    setFilename(name);
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }, []);

  const selectAllCategories = useCallback(() => {
    setSelectedCategories([...CATEGORY_NAMES]);
  }, []);

  const deselectAllCategories = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  const filteredExpenses = useMemo(
    () => filterExpenses(expenses, dateFrom, dateTo, selectedCategories),
    [expenses, dateFrom, dateTo, selectedCategories]
  );

  const previewExpenses = useMemo(() => filteredExpenses.slice(0, 5), [filteredExpenses]);

  const totalAmount = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

  const hasMore = filteredExpenses.length > 5;
  const remainingCount = filteredExpenses.length - 5;

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await executeExport({
        expenses,
        format,
        filename,
        dateFrom,
        dateTo,
        categories: selectedCategories,
      });
      return true;
    } catch {
      return false;
    } finally {
      setIsExporting(false);
    }
  }, [expenses, format, filename, dateFrom, dateTo, selectedCategories]);

  const resetConfig = useCallback(() => {
    setFormatState("csv");
    setDateFrom("");
    setDateTo("");
    setSelectedCategories([...CATEGORY_NAMES]);
    setFilename(generateDefaultFilename());
    setIsExporting(false);
    userEditedFilename.current = false;
  }, []);

  return {
    format,
    setFormat,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    selectedCategories,
    toggleCategory,
    selectAllCategories,
    deselectAllCategories,
    filename,
    setFilename: setCustomFilename,
    isExporting,
    filteredExpenses,
    previewExpenses,
    totalAmount,
    hasMore,
    remainingCount,
    handleExport,
    resetConfig,
  };
}
