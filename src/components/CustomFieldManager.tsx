
import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Save, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomField } from '@/types/Product';
import SecurityModal from './SecurityModal';

interface CustomFieldManagerProps {
  customFields: CustomField[];
  onSave: (fields: CustomField[]) => void;
  onClose: () => void;
}

const CustomFieldManager: React.FC<CustomFieldManagerProps> = ({ customFields, onSave, onClose }) => {
  const [fields, setFields] = useState<CustomField[]>(customFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityAction, setSecurityAction] = useState<{ type: 'add' | 'edit' | 'delete' | 'save', data?: any }>({ type: 'add' });
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
    setShowAddForm(false);
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

  const handleSecuritySubmit = (action: 'add' | 'edit' | 'delete' | 'save', data?: any) => {
    setSecurityAction({ type: action, data });
    setShowSecurityModal(true);
  };

  const handleSecuritySuccess = () => {
    setShowSecurityModal(false);
    
    switch (securityAction.type) {
      case 'add':
        setShowAddForm(true);
        break;
      case 'edit':
        setEditingField(securityAction.data);
        break;
      case 'delete':
        deleteField(securityAction.data);
        break;
      case 'save':
        handleSave();
        break;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'text': return 'نص';
      case 'number': return 'رقم';
      case 'textarea': return 'نص طويل';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg ml-3 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            إدارة الحقول المخصصة
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
          {/* Add New Field Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">قائمة الحقول ({fields.length})</h3>
            <Button
              onClick={() => handleSecuritySubmit('add')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 px-6"
            >
              <Plus className="w-5 h-5 ml-2" />
              إضافة حقل جديد
            </Button>
          </div>

          {/* Add New Field Form */}
          {showAddForm && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4">إضافة حقل جديد</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="fieldName" className="text-sm font-medium text-gray-700">
                    اسم الحقل
                  </Label>
                  <Input
                    id="fieldName"
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    placeholder="مثال: color"
                    className="mt-1 h-10"
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
                    className="mt-1 h-10"
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
                    className="mt-1 w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="text">نص</option>
                    <option value="number">رقم</option>
                    <option value="textarea">نص طويل</option>
                  </select>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="fieldRequired"
                      checked={newField.required}
                      onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                      className="ml-2 w-4 h-4"
                    />
                    <Label htmlFor="fieldRequired" className="text-sm font-medium text-gray-700">
                      حقل مطلوب
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={addField}
                  disabled={!newField.name || !newField.label}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Save className="w-4 h-4 ml-2" />
                  إضافة
                </Button>
                <Button
                  onClick={() => setShowAddForm(false)}
                  variant="outline"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}

          {/* Fields List */}
          <div>
            {fields.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">لا توجد حقول مخصصة</h3>
                <p className="text-gray-400 mb-4">أضف حقلك الأول للبدء</p>
                <Button
                  onClick={() => handleSecuritySubmit('add')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة حقل
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.id} className="bg-white border-2 border-gray-200 p-4 rounded-xl hover:shadow-lg transition-shadow">
                    {editingField === field.id ? (
                      <div className="space-y-3">
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          placeholder="العنوان المعروض"
                          className="h-10"
                        />
                        <select
                          value={field.type}
                          onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="text">نص</option>
                          <option value="number">رقم</option>
                          <option value="textarea">نص طويل</option>
                        </select>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="ml-2 w-4 h-4"
                            />
                            <span className="text-sm">مطلوب</span>
                          </div>
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
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-lg text-gray-800">{field.label}</h4>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSecuritySubmit('edit', field.id)}
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleSecuritySubmit('delete', field.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full ml-2">
                            {getTypeLabel(field.type)}
                          </span>
                          <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full ml-2">
                            {field.name}
                          </span>
                          {field.required && (
                            <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              مطلوب
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12 text-lg border-2"
            >
              إلغاء
            </Button>
            <Button
              onClick={() => handleSecuritySubmit('save')}
              className="flex-1 h-12 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Save className="w-5 h-5 ml-2" />
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </div>
      
      {/* Security Modal */}
      {showSecurityModal && (
        <SecurityModal
          onSuccess={handleSecuritySuccess}
          onCancel={() => setShowSecurityModal(false)}
          action={
            securityAction.type === 'add' ? 'إضافة حقل جديد' :
            securityAction.type === 'edit' ? 'تعديل حقل' :
            securityAction.type === 'delete' ? 'حذف حقل' : 'حفظ التغييرات'
          }
        />
      )}
    </div>
  );
};

export default CustomFieldManager;
