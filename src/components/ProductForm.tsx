
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Product, CustomField } from '@/types/Product';

interface ProductFormProps {
  product?: Product | null;
  customFields?: CustomField[];
  onSave: (product: Product | Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, customFields = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    sku: '',
    quantity: 0,
    customFields: {} as { [key: string]: string }
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        sku: product.sku,
        quantity: product.quantity,
        customFields: product.customFields || {}
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (product) {
      onSave({ 
        ...product, 
        ...formData, 
        customFields: formData.customFields 
      });
    } else {
      onSave({ 
        ...formData, 
        createdAt: new Date().toISOString(),
        customFields: formData.customFields
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCustomFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldName]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header with Moroccan styling */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-amber-50 to-red-50">
          <h2 className="text-xl font-semibold text-gray-800">
            {product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </h2>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              اسم المنتج *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1"
              placeholder="أدخل اسم المنتج"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              الوصف
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 min-h-[80px]"
              placeholder="أدخل وصف المنتج"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                السعر *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                الكمية *
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              الفئة *
            </Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1"
              placeholder="أدخل الفئة"
            />
          </div>

          <div>
            <Label htmlFor="sku" className="text-sm font-medium text-gray-700">
              رمز المنتج *
            </Label>
            <Input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className="mt-1"
              placeholder="أدخل رمز المنتج"
            />
          </div>

          {/* Custom Fields */}
          {customFields.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">الحقول المخصصة</h3>
              <div className="space-y-3">
                {customFields.map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                      {field.label} {field.required && '*'}
                    </Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={field.name}
                        value={formData.customFields[field.name] || ''}
                        onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                        required={field.required}
                        className="mt-1"
                        placeholder={`أدخل ${field.label}`}
                      />
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type}
                        value={formData.customFields[field.name] || ''}
                        onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                        required={field.required}
                        className="mt-1"
                        placeholder={`أدخل ${field.label}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700"
            >
              <Save className="w-4 h-4 ml-2" />
              {product ? 'تحديث' : 'حفظ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
