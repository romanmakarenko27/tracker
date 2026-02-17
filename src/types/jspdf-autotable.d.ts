import "jspdf";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: {
      head?: string[][];
      body?: string[][];
      startY?: number;
      theme?: string;
      headStyles?: Record<string, unknown>;
      styles?: Record<string, unknown>;
      margin?: { top?: number; right?: number; bottom?: number; left?: number };
      didDrawPage?: (data: { pageNumber: number; pageCount: number }) => void;
    }) => jsPDF;
  }
}
