
import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <Input
        type="text"
        placeholder="البحث عن المنتجات برقم المرجع أو الاسم..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-8 py-6 text-xl rounded-2xl border-2 border-amber-200 focus:border-amber-500 transition-colors text-right bg-white/90 backdrop-blur-sm shadow-lg"
      />
    </div>
  );
};

export default SearchBar;
