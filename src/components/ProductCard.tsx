import React, { useState } from 'react';
import { Edit2, Trash2, QrCode, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import QRCodeModal from '@/components/QRCodeModal';
import { Product } from '@/types/Product';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const [showQRModal, setShowQRModal] = useState(false);

  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      onDelete(product.id);
    }
  };

  const getMainImage = () => {
    return product.frontImage || product.backImage || product.supportImage;
  };

  const mainImage = getMainImage();

  return (
    <>
      <Card className="group bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl overflow-hidden transform hover:-translate-y-1" dir="rtl">
        {mainImage && (
          <div className="h-48 overflow-hidden">
            <img 
              src={mainImage} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <CardHeader className="bg-gradient-to-r from-amber-500 to-red-600 text-white p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-tight mb-1">{product.name}</h3>
              {product.reference_id && (
                <div className="flex items-center text-white text-opacity-90 text-sm">
                  <Hash className="w-4 h-4 ml-1" />
                  {product.reference_id}
                </div>
              )}
            </div>
            <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-0 mr-2">
              {product.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {product.customFields && Object.keys(product.customFields).length > 0 && (
            <div className="space-y-1">
              {Object.entries(product.customFields).slice(0, 3).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-500 truncate">{key}:</span>
                  <span className="font-medium text-gray-700 truncate mr-2">{value}</span>
                </div>
              ))}
              {Object.keys(product.customFields).length > 3 && (
                <div className="text-xs text-gray-400">
                  +{Object.keys(product.customFields).length - 3} المزيد
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 space-y-3">
          <div className="flex gap-2 w-full">
            <Button
              onClick={() => setShowQRModal(true)}
              variant="outline"
              size="sm"
              className="flex-1 border-green-200 text-green-600 hover:bg-green-50 h-10"
            >
              <QrCode className="w-4 h-4 ml-1" />
              QR
            </Button>
            <Button
              onClick={() => onEdit(product)}
              variant="outline"
              size="sm"
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 h-10"
            >
              <Edit2 className="w-4 h-4 ml-1" />
              تعديل
            </Button>
          </div>
          <Button
            onClick={handleDelete}
            variant="outline"
            size="sm"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 h-10"
          >
            <Trash2 className="w-4 h-4 ml-1" />
            حذف
          </Button>
        </CardFooter>
      </Card>

      {showQRModal && (
        <QRCodeModal
          product={product}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
