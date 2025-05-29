import React, { useState, useEffect } from 'react';
import { Plus, Scan, Package, Upload, Settings, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductForm from '@/components/ProductForm';
import ProductCard from '@/components/ProductCard';
import Scanner from '@/components/Scanner';
import QRImporter from '@/components/QRImporter';
import CustomFieldManager from '@/components/CustomFieldManager';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import CategorySidebar from '@/components/CategorySidebar';
import SecurityModal from '@/components/SecurityModal';
import ImageSearchModal from '@/components/ImageSearchModal';
import { Product, CustomField } from '@/types/Product';
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const {
    products,
    customFields,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProductByImage
  } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [showFieldManager, setShowFieldManager] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityAction, setSecurityAction] = useState<{type: string, callback: () => void}>({type: "", callback: () => {}});

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addProduct(product);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await updateProduct(updatedProduct);
      setEditingProduct(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setSecurityAction({
      type: "حذف المنتج",
      callback: async () => {
        try {
          await deleteProduct(id);
          setShowSecurityModal(false);
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    });
    setShowSecurityModal(true);
  };

  const handleEdit = (product: Product) => {
    setSecurityAction({
      type: "تعديل المنتج",
      callback: () => {
        setEditingProduct(product);
        setShowForm(true);
        setShowSecurityModal(false);
      }
    });
    setShowSecurityModal(true);
  };

  const handleAddNewProduct = () => {
    setSecurityAction({
      type: "إضافة منتج جديد",
      callback: () => {
        setEditingProduct(null);
        setShowForm(true);
        setShowSecurityModal(false);
      }
    });
    setShowSecurityModal(true);
  };

  const handleManageFields = () => {
    setSecurityAction({
      type: "إدارة الحقول المخصصة",
      callback: () => {
        setShowFieldManager(true);
        setShowSecurityModal(false);
      }
    });
    setShowSecurityModal(true);
  };

  const handleImageSearch = () => {
    setShowImageSearch(true);
  };

  const handleProductFoundByImage = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

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

  // Extract unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Count products per category
  const productCounts = categories.reduce<{[key: string]: number}>((acc, category) => {
    acc[category] = products.filter(p => p.category === category).length;
    return acc;
  }, {});

  // Filter products by category and search term
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.reference_id && product.reference_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      Object.entries(product.customFields || {}).some(
        ([key, value]) => 
          key.toLowerCase().includes(searchTerm.toLowerCase()) || 
          value.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory = selectedCategory === null || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-spin" />
          <p className="text-xl text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

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
        {/* Header */}
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

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Button
            onClick={handleAddNewProduct}
            className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white px-8 py-6 rounded-2xl shadow-xl transition-all duration-200 hover:shadow-2xl border-0 h-auto"
          >
            <Plus className="w-6 h-6 ml-3" />
            <div className="text-right">
              <div className="text-lg font-bold">إضافة منتج</div>
              <div className="text-sm opacity-90">منتج جديد</div>
            </div>
          </Button>
          
          <Button
            onClick={handleImageSearch}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-2xl shadow-xl transition-all duration-200 hover:shadow-2xl border-0 h-auto"
          >
            <Camera className="w-6 h-6 ml-3" />
            <div className="text-right">
              <div className="text-lg font-bold">البحث بالصورة</div>
              <div className="text-sm opacity-90">التقط و ابحث</div>
            </div>
          </Button>
          
          <Button
            onClick={() => setShowScanner(true)}
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
            onClick={() => setShowImporter(true)}
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
            onClick={handleManageFields}
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

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <Input
            type="text"
            placeholder="البحث عن المنتجات برقم المرجع أو الاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-8 py-6 text-xl rounded-2xl border-2 border-amber-200 focus:border-amber-500 transition-colors text-right bg-white/90 backdrop-blur-sm shadow-lg"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Category Sidebar */}
          {categories.length > 0 && (
            <div className="md:w-64">
              <CategorySidebar 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
                productCounts={productCounts}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
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
                    onClick={handleAddNewProduct}
                    className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white px-8 py-4 text-lg rounded-xl"
                  >
                    <Plus className="w-6 h-6 ml-2" />
                    إضافة أول منتج
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showForm && (
          <ProductForm
            product={editingProduct}
            customFields={customFields}
            onSave={editingProduct ? handleUpdateProduct : handleAddProduct}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        )}

        {showImageSearch && (
          <ImageSearchModal
            onClose={() => setShowImageSearch(false)}
            onProductFound={handleProductFoundByImage}
            onSearch={searchProductByImage}
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
            onSave={() => {}} // This will be handled by the hook
            onClose={() => setShowFieldManager(false)}
          />
        )}

        {showProductDetails && selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => {
              setShowProductDetails(false);
              setSelectedProduct(null);
            }}
            onEdit={(product) => {
              setEditingProduct(product);
              setShowForm(true);
              setShowProductDetails(false);
            }}
          />
        )}

        {showSecurityModal && (
          <SecurityModal
            onSuccess={securityAction.callback}
            onCancel={() => setShowSecurityModal(false)}
            action={securityAction.type}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
