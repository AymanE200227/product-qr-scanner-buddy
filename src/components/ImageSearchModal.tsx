
import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Search, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/Product';

interface ImageSearchModalProps {
  onClose: () => void;
  onProductFound: (product: Product) => void;
  onSearch: (imageFile: File) => Promise<Product | null>;
}

const ImageSearchModal: React.FC<ImageSearchModalProps> = ({ onClose, onProductFound, onSearch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setError(null);
      }
    } catch (err) {
      setError('لا يمكن الوصول إلى الكاميرا');
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async () => {
    if (!capturedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      // Convert base64 to File object
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'search-image.jpg', { type: 'image/jpeg' });

      const foundProduct = await onSearch(file);
      
      if (foundProduct) {
        onProductFound(foundProduct);
        onClose();
      } else {
        setError('لم يتم العثور على منتج مطابق لهذه الصورة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث عن المنتج');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setCapturedImage(null);
    setError(null);
    stopCamera();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg ml-3 flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            البحث بالصورة
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!capturedImage ? (
            <div className="space-y-6">
              {/* Camera Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Camera className="w-6 h-6 ml-2 text-green-600" />
                  التقاط صورة جديدة
                </h3>
                
                {!isCameraActive ? (
                  <Button
                    onClick={startCamera}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Camera className="w-5 h-5 ml-2" />
                    تشغيل الكاميرا
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 object-cover rounded-lg bg-gray-200"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={captureImage}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Camera className="w-5 h-5 ml-2" />
                        التقاط
                      </Button>
                      <Button
                        onClick={stopCamera}
                        variant="outline"
                        className="flex-1"
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* File Upload Section */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Upload className="w-6 h-6 ml-2 text-amber-600" />
                  رفع صورة من الجهاز
                </h3>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-12 border-2 border-dashed border-amber-300 hover:bg-amber-50"
                >
                  <Upload className="w-5 h-5 ml-2 text-amber-600" />
                  اختيار صورة
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Captured Image */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">الصورة المحددة</h3>
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <p className="text-red-600 text-center">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 ml-2 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 ml-2" />
                  )}
                  {isLoading ? 'جاري البحث...' : 'البحث عن المنتج'}
                </Button>
                <Button
                  onClick={resetSearch}
                  variant="outline"
                  className="flex-1 h-12"
                  disabled={isLoading}
                >
                  صورة جديدة
                </Button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ImageSearchModal;
