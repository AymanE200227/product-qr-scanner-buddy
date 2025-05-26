
import React, { useState } from 'react';
import { X, Edit2, Package, Tag, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/Product';
import SecurityModal from './SecurityModal';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose, onEdit }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  
  const images = [
    product.frontImage, 
    product.backImage, 
    product.supportImage
  ].filter(Boolean) as string[];
  
  const handleEditClick = () => {
    setShowSecurityModal(true);
  };

  const handleSecuritySuccess = () => {
    setShowSecurityModal(false);
    onEdit(product);
  };

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg ml-3 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            تفاصيل المنتج
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
          {/* Product Images */}
          {images.length > 0 && (
            <div className="relative">
              <div className="w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                <img 
                  src={images[currentImageIndex]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {images.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    variant="outline"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 w-8 h-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={nextImage}
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 w-8 h-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-amber-600' : 'bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              <div className="flex justify-center mt-3 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 ${
                      idx === currentImageIndex ? 'border-amber-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`صورة ${idx+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Name & Category */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h3>
            <Badge className="bg-gradient-to-r from-amber-500 to-red-600 text-white px-4 py-2 text-lg">
              {product.category}
            </Badge>
          </div>

          {/* Custom Fields */}
          {product.customFields && Object.keys(product.customFields).length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
              <h4 className="font-semibold text-amber-700 mb-3 flex items-center">
                <Tag className="w-5 h-5 ml-2" />
                المعلومات التفصيلية
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(product.customFields).map(([key, value]) => (
                  <div key={key} className="bg-white p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-600">{key}</div>
                    <div className="text-lg font-semibold text-gray-800">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Created Date */}
          {product.createdAt && (
            <div className="text-center text-sm text-gray-500">
              تم الإنشاء: {new Date(product.createdAt).toLocaleDateString('ar-SA')}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              onClick={handleEditClick}
              className="flex-1 h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Edit2 className="w-5 h-5 ml-2" />
              تعديل المنتج
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12 text-lg border-2"
            >
              إغلاق
            </Button>
          </div>
        </div>
      </div>

      {/* Security Modal */}
      {showSecurityModal && (
        <SecurityModal
          onSuccess={handleSecuritySuccess}
          onCancel={() => setShowSecurityModal(false)}
          action="تعديل المنتج"
        />
      )}
    </div>
  );
};

export default ProductDetailsModal;
