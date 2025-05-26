
import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Image as ImageIcon } from 'lucide-react';
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
    image: '',
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
        image: product.image || '',
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-amber-50 to-red-50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-red-600 rounded-lg ml-3 flex items-center justify-center">
              <Save className="w-5 h-5 text-white" />
            </div>
            {product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </h2>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              صورة المنتج
            </Label>
            <div className="flex items-center gap-4">
              {formData.image && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-200">
                  <img 
                    src={formData.image} 
                    alt="Product" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Label 
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-12 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  <Upload className="w-5 h-5 ml-2 text-blue-600" />
                  <span className="text-blue-600 font-medium">
                    {formData.image ? 'تغيير الصورة' : 'رفع صورة'}
                  </span>
                </Label>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                اسم المنتج *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 h-12 text-lg"
                placeholder="أدخل اسم المنتج"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                الوصف
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-2 min-h-[100px] text-lg"
                placeholder="أدخل وصف المنتج"
              />
            </div>

            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                السعر (درهم) *
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
                className="mt-2 h-12 text-lg"
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
                className="mt-2 h-12 text-lg"
                placeholder="0"
              />
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
                className="mt-2 h-12 text-lg"
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
                className="mt-2 h-12 text-lg"
                placeholder="أدخل رمز المنتج"
              />
            </div>
          </div>

          {/* Custom Fields */}
          {customFields.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-md ml-2 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
                الحقول المخصصة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customFields.map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={field.name}
                        value={formData.customFields[field.name] || ''}
                        onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                        required={field.required}
                        className="mt-2"
                        placeholder={`أدخل ${field.label}`}
                      />
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type}
                        value={formData.customFields[field.name] || ''}
                        onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                        required={field.required}
                        className="mt-2 h-10"
                        placeholder={`أدخل ${field.label}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 h-12 text-lg border-2"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 text-lg bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700"
            >
              <Save className="w-5 h-5 ml-2" />
              {product ? 'تحديث' : 'حفظ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
