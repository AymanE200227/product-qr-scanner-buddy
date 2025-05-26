
import React from 'react';
import { X, Edit2, Package, Tag, DollarSign, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/Product';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose, onEdit }) => {
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
          {/* Product Image */}
          {product.image && (
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
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

          {/* Description */}
          {product.description && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-700 mb-2">الوصف</h4>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 text-green-600 ml-2" />
                <span className="text-sm font-medium text-green-700">السعر</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{product.price.toFixed(2)} درهم</div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center mb-2">
                <Package className="w-5 h-5 text-blue-600 ml-2" />
                <span className="text-sm font-medium text-blue-700">الكمية</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{product.quantity}</div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center mb-2">
                <Hash className="w-5 h-5 text-purple-600 ml-2" />
                <span className="text-sm font-medium text-purple-700">رمز المنتج</span>
              </div>
              <div className="text-lg font-bold text-purple-600">{product.sku}</div>
            </div>
          </div>

          {/* Custom Fields */}
          {product.customFields && Object.keys(product.customFields).length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
              <h4 className="font-semibold text-amber-700 mb-3 flex items-center">
                <Tag className="w-5 h-5 ml-2" />
                معلومات إضافية
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
              onClick={() => onEdit(product)}
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
    </div>
  );
};

export default ProductDetailsModal;
