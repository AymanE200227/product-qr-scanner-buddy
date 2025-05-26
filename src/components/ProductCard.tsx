
import React, { useState } from 'react';
import { Edit2, Trash2, QrCode } from 'lucide-react';
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

  return (
    <>
      <Card className="group bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 rounded-xl overflow-hidden" dir="rtl">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-red-600 text-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
              <p className="text-amber-100 text-sm mt-1">رمز المنتج: {product.sku}</p>
            </div>
            <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-0">
              {product.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-500">السعر:</span>
              <div className="font-semibold text-green-600 text-lg">{product.price.toFixed(2)} درهم</div>
            </div>
            <div>
              <span className="text-gray-500">الكمية:</span>
              <div className="font-semibold text-gray-800">{product.quantity}</div>
            </div>
          </div>

          {/* Custom Fields */}
          {product.customFields && Object.keys(product.customFields).length > 0 && (
            <div className="border-t pt-3">
              <div className="space-y-1">
                {Object.entries(product.customFields).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-500">{key}:</span>
                    <span className="font-medium text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 space-y-2">
          <div className="flex gap-2 w-full">
            <Button
              onClick={() => setShowQRModal(true)}
              variant="outline"
              size="sm"
              className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
            >
              <QrCode className="w-4 h-4 ml-1" />
              رمز QR
            </Button>
            <Button
              onClick={() => onEdit(product)}
              variant="outline"
              size="sm"
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Edit2 className="w-4 h-4 ml-1" />
              تعديل
            </Button>
          </div>
          <Button
            onClick={handleDelete}
            variant="outline"
            size="sm"
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
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
