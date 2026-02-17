"use client";

import { useEffect, useRef } from "react";
import { renderQRCode } from "@/lib/export-sharing";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface QRCodeDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  filename: string;
}

export function QRCodeDisplay({ isOpen, onClose, url, filename }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      renderQRCode(canvasRef.current, url, 200);
    }
  }, [isOpen, url]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">QR Code</h3>
        <p className="text-sm text-gray-500 mb-4">{filename}</p>

        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
            <canvas ref={canvasRef} className="w-[200px] h-[200px]" />
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4 break-all">{url}</p>

        <Button variant="secondary" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </Modal>
  );
}
