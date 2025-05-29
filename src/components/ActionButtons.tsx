
import React from 'react';
import { Plus, Scan, Upload, Settings, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onAddProduct: () => void;
  onImageSearch: () => void;
  onScan: () => void;
  onImport: () => void;
  onManageFields: () => void;
}

const ActionButtons = ({
  onAddProduct,
  onImageSearch,
  onScan,
  onImport,
  onManageFields
}: ActionButtonsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <Button
        onClick={onAddProduct}
        className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white px-8 py-6 rounded-2xl shadow-xl transition-all duration-200 hover:shadow-2xl border-0 h-auto"
      >
        <Plus className="w-6 h-6 ml-3" />
        <div className="text-right">
          <div className="text-lg font-bold">إضافة منتج</div>
          <div className="text-sm opacity-90">منتج جديد</div>
        </div>
      </Button>
      
      <Button
        onClick={onImageSearch}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-2xl shadow-xl transition-all duration-200 hover:shadow-2xl border-0 h-auto"
      >
        <Camera className="w-6 h-6 ml-3" />
        <div className="text-right">
          <div className="text-lg font-bold">البحث بالصورة</div>
          <div className="text-sm opacity-90">التقط و ابحث</div>
        </div>
      </Button>
      
      <Button
        onClick={onScan}
        variant="outline"
        className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-6 rounded-2xl shadow-xl transition-all duration-200 hover:shadow-2xl h-auto"
      >
        <Scan className="w-6 h-6 ml-3" />
        <div className="text-right">
          <div className="text-lg font-bold">مسح رمز QR</div>
          <div className="text-sm opacity-70">من الكاميرا</div>
        </div>
      </Button>
      
      <Button
        onClick={onImport}
        variant="outline"
        className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-2xl shadow-xl transition-all duration-200 hover:shadow-2xl h-auto"
      >
        <Upload className="w-6 h-6 ml-3" />
        <div className="text-right">
          <div className="text-lg font-bold">استيراد QR</div>
          <div className="text-sm opacity-70">من الجهاز</div>
        </div>
      </Button>
      
      <Button
        onClick={onManageFields}
        variant="outline"
        className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-6 rounded-2xl shadow-xl transition-all duration-200 hover:shadow-2xl h-auto"
      >
        <Settings className="w-6 h-6 ml-3" />
        <div className="text-right">
          <div className="text-lg font-bold">إدارة الحقول</div>
          <div className="text-sm opacity-70">حقول مخصصة</div>
        </div>
      </Button>
    </div>
  );
};

export default ActionButtons;
