
import React from 'react';
import { Package } from 'lucide-react';

const Header = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center items-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-red-600 rounded-2xl flex items-center justify-center ml-4 shadow-xl">
          <Package className="w-12 h-12 text-white" />
        </div>
        <div>
          <h1 className="text-5xl font-bold text-gray-800 mb-2">زربية</h1>
          <div className="text-xl text-amber-700 font-semibold">إدارة المنتجات المتقدمة</div>
        </div>
      </div>
      <p className="text-gray-600 text-xl">إدارة مخزونك باستخدام رموز QR بطريقة احترافية</p>
      
      {/* Decorative border */}
      <div className="mt-8 flex justify-center">
        <div className="w-40 h-2 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default Header;
