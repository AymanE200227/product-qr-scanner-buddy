
import React, { useEffect, useRef } from 'react';
import { X, Printer, Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/Product';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  product: Product;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ product, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const getMainImage = () => {
    return product.frontImage || product.backImage || product.supportImage;
  };

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
            .product-category { 
              font-size: 14px; 
              margin-bottom: 15px; 
              color: #666;
              background: #f0f0f0;
              padding: 5px 10px;
              border-radius: 10px;
              display: inline-block;
            }
            .custom-fields {
              margin-top: 10px;
              text-align: left;
              direction: rtl;
            }
            .custom-field {
              margin: 5px 0;
              font-size: 12px;
            }
            .custom-field-label {
              font-weight: bold;
            }
            canvas { 
              border: 1px solid #ddd; 
              margin: 15px 0;
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
      link.download = `qr-code-${product.name}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <h2 className="text-xl font-semibold text-gray-800">معلومات المنتج وكود QR</h2>
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
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <div className="flex items-center justify-center h-full">
                <div ref={printAreaRef} className="text-center border-2 border-gray-200 p-6 rounded-lg w-full">
                  <div className="product-name">{product.name}</div>
                  <div className="mb-3">
                    <Badge className="bg-gradient-to-r from-amber-500 to-red-600 text-white">
                      {product.category}
                    </Badge>
                  </div>
                  <canvas ref={canvasRef} className="mx-auto mb-3 border border-gray-200 rounded" />
                  
                  {product.customFields && Object.keys(product.customFields).length > 0 && (
                    <div className="text-right text-sm space-y-1 mt-4 border-t pt-2">
                      {Object.entries(product.customFields).map(([key, value]) => (
                        <div key={key} className="custom-field">
                          <span className="custom-field-label">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    امسح للحصول على معلومات المنتج
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-gray-800">معلومات المنتج</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">الاسم</div>
                    <div className="font-medium">{product.name}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">الفئة</div>
                    <div className="font-medium">{product.category}</div>
                  </div>
                  
                  {product.createdAt && (
                    <div>
                      <div className="text-sm text-gray-600">تاريخ الإنشاء</div>
                      <div className="font-medium">{new Date(product.createdAt).toLocaleDateString('ar-SA')}</div>
                    </div>
                  )}
                </div>
              </div>
              
              {product.customFields && Object.keys(product.customFields).length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-bold text-lg mb-3 text-amber-800">التفاصيل المخصصة</h3>
                  <div className="space-y-2">
                    {Object.entries(product.customFields).map(([key, value]) => (
                      <div key={key} className="flex justify-between bg-white p-2 rounded">
                        <span className="text-gray-600">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Images */}
              {(product.frontImage || product.backImage || product.supportImage) && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-lg mb-3 text-blue-800">الصور</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {product.frontImage && (
                      <div className="aspect-square rounded overflow-hidden border border-gray-200">
                        <img src={product.frontImage} alt="أمامية" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {product.backImage && (
                      <div className="aspect-square rounded overflow-hidden border border-gray-200">
                        <img src={product.backImage} alt="خلفية" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {product.supportImage && (
                      <div className="aspect-square rounded overflow-hidden border border-gray-200">
                        <img src={product.supportImage} alt="إضافية" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1 border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تنزيل QR
                </Button>
                <Button
                  onClick={handlePrint}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Printer className="w-4 h-4 ml-2" />
                  طباعة
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
