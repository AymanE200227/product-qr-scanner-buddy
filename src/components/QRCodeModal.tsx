
import React, { useEffect, useRef } from 'react';
import { X, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/Product';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  product: Product;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ product, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Generate QR code with product ID
      QRCode.toCanvas(canvasRef.current, product.id, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch(err => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [product.id]);

  const handlePrint = () => {
    const printContent = printAreaRef.current;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    const printHtml = `
      <html>
        <head>
          <title>QR Code - ${product.name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh;
            }
            .print-container { 
              text-align: center; 
              border: 2px solid #000; 
              padding: 20px; 
              max-width: 300px;
            }
            .product-name { 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 10px; 
            }
            .product-info { 
              font-size: 12px; 
              margin-bottom: 15px; 
              color: #666;
            }
            canvas { 
              border: 1px solid #ddd; 
            }
            @media print {
              body { margin: 0; }
              .print-container { border: 2px solid #000; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printHtml);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `qr-code-${product.sku}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">QR Code</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div ref={printAreaRef} className="print-container text-center">
            <div className="product-name">{product.name}</div>
            <div className="product-info">
              SKU: {product.sku} | ${product.price.toFixed(2)}
            </div>
            <canvas ref={canvasRef} className="mx-auto mb-4 border border-gray-200 rounded" />
            <div className="text-xs text-gray-500">
              Scan to view product details
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handlePrint}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
