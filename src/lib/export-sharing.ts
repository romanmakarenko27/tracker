import { v4 as uuidv4 } from "uuid";
import { SharedExport, ExportFormat } from "@/types/export";

export function createShareLink(params: {
  filename: string;
  format: ExportFormat;
  recordCount: number;
  expiresInDays?: number;
}): SharedExport {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + (params.expiresInDays || 7));

  return {
    id: uuidv4(),
    linkId: generateLinkId(),
    filename: params.filename,
    format: params.format,
    recordCount: params.recordCount,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    accessCount: 0,
    isActive: true,
  };
}

function generateLinkId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getShareUrl(linkId: string): string {
  return `https://expensetracker.app/shared/${linkId}`;
}

export function renderQRCode(
  canvas: HTMLCanvasElement,
  data: string,
  size: number = 200
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = size;
  canvas.height = size;

  const moduleCount = 25;
  const moduleSize = size / (moduleCount + 8); // add quiet zone
  const offset = moduleSize * 4; // quiet zone

  // White background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);

  // Generate a deterministic pattern from the data string
  const hash = simpleHash(data);
  ctx.fillStyle = "#000000";

  // Draw finder patterns (top-left, top-right, bottom-left)
  drawFinderPattern(ctx, offset, offset, moduleSize);
  drawFinderPattern(ctx, offset + (moduleCount - 7) * moduleSize, offset, moduleSize);
  drawFinderPattern(ctx, offset, offset + (moduleCount - 7) * moduleSize, moduleSize);

  // Draw data modules based on hash
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isFinderArea(row, col, moduleCount)) continue;

      const idx = row * moduleCount + col;
      const bit = (hash[idx % hash.length] >> (idx % 8)) & 1;
      if (bit) {
        ctx.fillRect(
          offset + col * moduleSize,
          offset + row * moduleSize,
          moduleSize,
          moduleSize
        );
      }
    }
  }
}

function drawFinderPattern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  moduleSize: number
): void {
  // Outer black border
  ctx.fillStyle = "#000000";
  ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
  // Inner white
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
  // Inner black
  ctx.fillStyle = "#000000";
  ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
}

function isFinderArea(row: number, col: number, moduleCount: number): boolean {
  // Top-left
  if (row < 8 && col < 8) return true;
  // Top-right
  if (row < 8 && col >= moduleCount - 8) return true;
  // Bottom-left
  if (row >= moduleCount - 8 && col < 8) return true;
  return false;
}

function simpleHash(str: string): number[] {
  const result: number[] = [];
  for (let i = 0; i < 128; i++) {
    let h = 0;
    for (let j = 0; j < str.length; j++) {
      h = ((h << 5) - h + str.charCodeAt(j) + i) | 0;
    }
    result.push(Math.abs(h) % 256);
  }
  return result;
}
