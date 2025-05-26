
import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Image as ImageIcon, Plus, Trash } from 'lucide-react';
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
    category: '',
    frontImage: '',
    backImage: '',
    supportImage: '',
    customFields: {} as { [key: string]: string }
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        frontImage: product.frontImage || '',
        backImage: product.backImage || '',
        supportImage: product.supportImage || '',
        customFields: product.customFields || {}
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (product) {
      onSave({ 
        ...product, 
        ...formData
      });
    } else {
      onSave({ 
        ...formData, 
        createdAt: new Date().toISOString()
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleImageUpload = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          [field]: event.target?.result as string
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
          {/* Required Fields */}
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
          </div>

          {/* Image Upload Sections */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              صور المنتج
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Front Image */}
              <div className="flex flex-col">
                <Label className="text-xs text-gray-600 mb-2">الصورة الأمامية</Label>
                <div className="flex items-center gap-4">
                  {formData.frontImage && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-200">
                      <img 
                        src={formData.frontImage} 
                        alt="Front" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('frontImage', e)}
                      className="hidden"
                      id="front-image-upload"
                    />
                    <Label 
                      htmlFor="front-image-upload"
                      className="flex items-center justify-center w-full h-12 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      <Upload className="w-5 h-5 ml-2 text-blue-600" />
                      <span className="text-blue-600 font-medium text-sm">
                        {formData.frontImage ? 'تغيير' : 'رفع'}
                      </span>
                    </Label>
                  </div>
                </div>
              </div>
              
              {/* Back Image */}
              <div className="flex flex-col">
                <Label className="text-xs text-gray-600 mb-2">الصورة الخلفية</Label>
                <div className="flex items-center gap-4">
                  {formData.backImage && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-200">
                      <img 
                        src={formData.backImage} 
                        alt="Back" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('backImage', e)}
                      className="hidden"
                      id="back-image-upload"
                    />
                    <Label 
                      htmlFor="back-image-upload"
                      className="flex items-center justify-center w-full h-12 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      <Upload className="w-5 h-5 ml-2 text-blue-600" />
                      <span className="text-blue-600 font-medium text-sm">
                        {formData.backImage ? 'تغيير' : 'رفع'}
                      </span>
                    </Label>
                  </div>
                </div>
              </div>
              
              {/* Support Image */}
              <div className="flex flex-col">
                <Label className="text-xs text-gray-600 mb-2">صورة إضافية</Label>
                <div className="flex items-center gap-4">
                  {formData.supportImage && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-200">
                      <img 
                        src={formData.supportImage} 
                        alt="Support" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('supportImage', e)}
                      className="hidden"
                      id="support-image-upload"
                    />
                    <Label 
                      htmlFor="support-image-upload"
                      className="flex items-center justify-center w-full h-12 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      <Upload className="w-5 h-5 ml-2 text-blue-600" />
                      <span className="text-blue-600 font-medium text-sm">
                        {formData.supportImage ? 'تغيير' : 'رفع'}
                      </span>
                    </Label>
                  </div>
                </div>
              </div>
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
