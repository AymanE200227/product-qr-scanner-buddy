import React, { useState } from 'react';
import { Package } from 'lucide-react';
import ProductForm from '@/components/ProductForm';
import Scanner from '@/components/Scanner';
import QRImporter from '@/components/QRImporter';
import CustomFieldManager from '@/components/CustomFieldManager';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import CategorySidebar from '@/components/CategorySidebar';
import SecurityModal from '@/components/SecurityModal';
import ImageSearchModal from '@/components/ImageSearchModal';
import Header from '@/components/Header';
import ActionButtons from '@/components/ActionButtons';
import SearchBar from '@/components/SearchBar';
import ProductsGrid from '@/components/ProductsGrid';
import EmptyState from '@/components/EmptyState';
import { Product } from '@/types/Product';
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

  const handleScanResult = (result: string) => {
    console.log('QR Scan result:', result);
    const foundProduct = products.find(p => p.id === result || p.reference_id === result);
    if (foundProduct) {
      setSelectedProduct(foundProduct);
      setShowProductDetails(true);
    }
    setShowScanner(false);
  };

  const handleImportResult = (result: string) => {
    console.log('QR Import result:', result);
    const foundProduct = products.find(p => p.id === result || p.reference_id === result);
    if (foundProduct) {
      setSelectedProduct(foundProduct);
      setShowProductDetails(true);
    }
    setShowImporter(false);
  };

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
        <Header />

        <ActionButtons
          onAddProduct={handleAddNewProduct}
          onImageSearch={handleImageSearch}
          onScan={() => setShowScanner(true)}
          onImport={() => setShowImporter(true)}
          onManageFields={handleManageFields}
        />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

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
            {filteredProducts.length > 0 ? (
              <ProductsGrid
                products={filteredProducts}
                onEdit={handleEdit}
                onDelete={handleDeleteProduct}
              />
            ) : (
              <EmptyState
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                onAddProduct={handleAddNewProduct}
              />
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
            onSave={() => {}}
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
