
import React from 'react';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  searchTerm: string;
  selectedCategory: string | null;
  onAddProduct: () => void;
}

const EmptyState = ({ searchTerm, selectedCategory, onAddProduct }: EmptyStateProps) => {
  return (
    <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl">
      <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-amber-200 to-red-200 rounded-full flex items-center justify-center">
        <Package className="w-20 h-20 text-amber-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-500 mb-4">لا توجد منتجات</h3>
      <p className="text-gray-400 mb-8 text-lg">
        {searchTerm || selectedCategory !== null ? 'جرب تعديل مصطلحات البحث' : 'أضف منتجك الأول للبدء'}
      </p>
      {!searchTerm && !selectedCategory && (
        <Button
          onClick={onAddProduct}
          className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white px-8 py-4 text-lg rounded-xl"
        >
          <Plus className="w-6 h-6 ml-2" />
          إضافة أول منتج
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
