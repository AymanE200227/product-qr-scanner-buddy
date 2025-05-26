
import React, { useRef, useState } from 'react';
import { X, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QrScanner from 'qr-scanner';

interface QRImporterProps {
  onImportResult: (result: string) => void;
  onClose: () => void;
}

const QRImporter: React.FC<QRImporterProps> = ({ onImportResult, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError('');

    try {
      const result = await QrScanner.scanImage(file);
      console.log('QR Code من الصورة:', result);
      onImportResult(result);
    } catch (err) {
      console.error('خطأ في قراءة رمز QR:', err);
      setError('لم يتم العثور على رمز QR صالح في الصورة');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">استيراد رمز QR</h2>
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
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <Upload className="w-12 h-12 text-blue-600" />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              اختر صورة تحتوي على رمز QR
            </h3>
            <p className="text-gray-600 mb-6">
              قم بتحديد صورة من جهازك تحتوي على رمز QR لاستيراد بيانات المنتج
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              onClick={handleButtonClick}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mb-4"
            >
              <Camera className="w-5 h-5 ml-2" />
              {isProcessing ? 'جاري المعالجة...' : 'اختيار صورة'}
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRImporter;
