import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomField } from '@/types/Product';

interface CustomFieldManagerProps {
  customFields: CustomField[];
  onSave: (fields: CustomField[]) => void;
  onClose: () => void;
}

const CustomFieldManager: React.FC<CustomFieldManagerProps> = ({ customFields, onSave, onClose }) => {
  const [fields, setFields] = useState<CustomField[]>(customFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newField, setNewField] = useState({
    name: '',
    label: '',
    type: 'text' as const,
    required: false
  });

  const addField = () => {
    if (!newField.name || !newField.label) return;

    const field: CustomField = {
      id: Date.now().toString(),
      name: newField.name,
      label: newField.label,
      type: newField.type,
      required: newField.required
    };

    setFields([...fields, field]);
    setNewField({ name: '', label: '', type: 'text', required: false });
  };

  const updateField = (id: string, updates: Partial<CustomField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
    setEditingField(null);
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleSave = () => {
    onSave(fields);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 className="text-xl font-semibold text-gray-800">إدارة الحقول المخصصة</h2>
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
        <div className="p-6 space-y-6">
          {/* Add New Field */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">إضافة حقل جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fieldName" className="text-sm font-medium text-gray-700">
                  اسم الحقل
                </Label>
                <Input
                  id="fieldName"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  placeholder="مثال: اللون"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fieldLabel" className="text-sm font-medium text-gray-700">
                  العنوان المعروض
                </Label>
                <Input
                  id="fieldLabel"
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  placeholder="مثال: لون المنتج"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fieldType" className="text-sm font-medium text-gray-700">
                  نوع الحقل
                </Label>
                <select
                  id="fieldType"
                  value={newField.type}
                  onChange={(e) => setNewField({ ...newField, type: e.target.value as any })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="text">نص</option>
                  <option value="number">رقم</option>
                  <option value="textarea">نص طويل</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fieldRequired"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  className="ml-2"
                />
                <Label htmlFor="fieldRequired" className="text-sm font-medium text-gray-700">
                  حقل مطلوب
                </Label>
              </div>
            </div>

            <Button
              onClick={addField}
              className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={!newField.name || !newField.label}
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة حقل
            </Button>
          </div>

          {/* Existing Fields */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">الحقول الموجودة</h3>
            {fields.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد حقول مخصصة</p>
            ) : (
              <div className="space-y-3">
                {fields.map((field) => (
                  <div key={field.id} className="bg-gray-50 p-4 rounded-lg border">
                    {editingField === field.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          placeholder="العنوان المعروض"
                        />
                        <select
                          value={field.type}
                          onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                          className="px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="text">نص</option>
                          <option value="number">رقم</option>
                          <option value="textarea">نص طويل</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => setEditingField(null)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800">{field.label}</div>
                          <div className="text-sm text-gray-500">
                            النوع: {field.type === 'text' ? 'نص' : field.type === 'number' ? 'رقم' : 'نص طويل'}
                            {field.required && ' • مطلوب'}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setEditingField(field.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => deleteField(field.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Save className="w-4 h-4 ml-2" />
              حفظ التغييرات
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomFieldManager;
