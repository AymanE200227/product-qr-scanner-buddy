
import React, { useEffect, useRef, useState } from 'react';
import { X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QrScanner from 'qr-scanner';

interface ScannerProps {
  onScanResult: (result: string) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanResult, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (videoRef.current) {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('تم اكتشاف رمز QR:', result.data);
          onScanResult(result.data);
        },
        {
          onDecodeError: (err) => {
            console.log('خطأ في فك التشفير:', err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      setQrScanner(scanner);

      scanner.start().catch((err) => {
        console.error('فشل في تشغيل الكاميرا:', err);
        setError('فشل في الوصول للكاميرا. يرجى التأكد من إعطاء صلاحيات الكاميرا.');
      });

      return () => {
        scanner.stop();
        scanner.destroy();
      };
    }
  }, [onScanResult]);

  const handleClose = () => {
    if (qrScanner) {
      qrScanner.stop();
      qrScanner.destroy();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <h2 className="text-xl font-semibold text-gray-800">مسح رمز QR</h2>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scanner */}
        <div className="p-6">
          {error ? (
            <div className="text-center py-8">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleClose} variant="outline">
                إغلاق
              </Button>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full rounded-lg"
                style={{ aspectRatio: '1/1' }}
              />
              <div className="absolute inset-0 border-2 border-green-400 rounded-lg pointer-events-none">
                <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-green-400"></div>
                <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-green-400"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-green-400"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-green-400"></div>
              </div>
            </div>
          )}

          <p className="text-center text-gray-600 text-sm mt-4">
            وجه الكاميرا نحو رمز QR للمسح
          </p>

          <Button
            onClick={handleClose}
            variant="outline"
            className="w-full mt-4"
          >
            إلغاء
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
