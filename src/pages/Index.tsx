
import React, { useState, useEffect } from 'react';
import { Plus, Scan, Package, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductForm from '@/components/ProductForm';
import ProductCard from '@/components/ProductCard';
import Scanner from '@/components/Scanner';
import QRImporter from '@/components/QRImporter';
import CustomFieldManager from '@/components/CustomFieldManager';
import { Product, CustomField } from '@/types/Product';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [showFieldManager, setShowFieldManager] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    
    const savedCustomFields = localStorage.getItem('customFields');
    if (savedCustomFields) {
      setCustomFields(JSON.parse(savedCustomFields));
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('customFields', JSON.stringify(customFields));
  }, [customFields]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts([...products, newProduct]);
    setShowForm(false);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    setShowForm(false);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleScanResult = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      console.log('المنتج الممسوح ضوئياً:', product);
    }
    setShowScanner(false);
  };

  const handleImportResult = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      console.log('المنتج المستورد:', product);
    }
    setShowImporter(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50" dir="rtl">
      {/* Moroccan Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-amber-600">
          <pattern id="moroccan" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10,2 L18,10 L10,18 L2,10 Z" fill="currentColor"/>
            <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#moroccan)"/>
        </svg>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Header with Moroccan styling */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-red-600 rounded-lg flex items-center justify-center ml-3 shadow-lg">
              <Package className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-1">زربية</h1>
              <div className="text-lg text-amber-700 font-semibold">إدارة المنتجات</div>
            </div>
          </div>
          <p className="text-gray-600 text-lg">إدارة مخزونك باستخدام رموز QR</p>
          
          {/* Decorative Moroccan border */}
          <div className="mt-6 flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 rounded-full"></div>
          </div>
        </div>

        {/* Action Buttons with Moroccan styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl border-2 border-amber-300"
          >
            <Plus className="w-5 h-5 ml-2" />
            إضافة منتج
          </Button>
          
          <Button
            onClick={() => setShowScanner(true)}
            variant="outline"
            className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-6 py-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <Scan className="w-5 h-5 ml-2" />
            مسح رمز QR
          </Button>
          
          <Button
            onClick={() => setShowImporter(true)}
            variant="outline"
            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <Upload className="w-5 h-5 ml-2" />
            استيراد رمز QR
          </Button>
          
          <Button
            onClick={() => setShowFieldManager(true)}
            variant="outline"
            className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-6 py-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            إدارة الحقول
          </Button>
        </div>

        {/* Search Bar with Moroccan styling */}
        <div className="max-w-md mx-auto mb-8">
          <Input
            type="text"
            placeholder="البحث عن المنتجات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-xl border-2 border-amber-200 focus:border-amber-500 transition-colors text-right bg-white/80 backdrop-blur-sm"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={deleteProduct}
            />
          ))}
        </div>

        {/* Empty State with Moroccan illustration */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-amber-200 to-red-200 rounded-full flex items-center justify-center">
              <Package className="w-16 h-16 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-500 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'جرب تعديل مصطلحات البحث' : 'أضف منتجك الأول للبدء'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white"
              >
                <Plus className="w-5 h-5 ml-2" />
                إضافة أول منتج
              </Button>
            )}
          </div>
        )}

        {/* Modals */}
        {showForm && (
          <ProductForm
            product={editingProduct}
            customFields={customFields}
            onSave={editingProduct ? updateProduct : addProduct}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        )}

        {showScanner && (
          <Scanner
            onScanResult={handleScanResult}
            onClose={() => setShowScanner(false)}
          />
        )}

        {showImporter && (
          <QRImporter
            onImportResult={handleImportResult}
            onClose={() => setShowImporter(false)}
          />
        )}

        {showFieldManager && (
          <CustomFieldManager
            customFields={customFields}
            onSave={setCustomFields}
            onClose={() => setShowFieldManager(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
