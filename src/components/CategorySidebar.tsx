
import React from 'react';
import { Package, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategorySidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  productCounts: { [key: string]: number };
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  productCounts
}) => {
  return (
    <div className="w-64 bg-white rounded-2xl shadow-lg p-4 h-fit sticky top-8" dir="rtl">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg ml-3 flex items-center justify-center">
          <Filter className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">الفئات</h3>
      </div>

      <div className="space-y-2">
        <Button
          onClick={() => onCategorySelect(null)}
          variant={selectedCategory === null ? "default" : "ghost"}
          className={`w-full justify-between h-12 ${
            selectedCategory === null 
              ? "bg-gradient-to-r from-amber-500 to-red-600 text-white" 
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center">
            <Package className="w-5 h-5 ml-2" />
            جميع المنتجات
          </div>
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
            {Object.values(productCounts).reduce((a, b) => a + b, 0)}
          </span>
        </Button>

        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => onCategorySelect(category)}
            variant={selectedCategory === category ? "default" : "ghost"}
            className={`w-full justify-between h-12 ${
              selectedCategory === category 
                ? "bg-gradient-to-r from-amber-500 to-red-600 text-white" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-red-500 rounded-full ml-2"></div>
              {category}
            </div>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
              {productCounts[category] || 0}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;
