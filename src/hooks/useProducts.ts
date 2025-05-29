
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, CustomField } from '@/types/Product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedProducts = data?.map(product => ({
        ...product,
        customFields: product.custom_fields || {}
      })) || [];
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCustomFields = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_fields')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCustomFields(data || []);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          category: product.category,
          front_image: product.frontImage,
          back_image: product.backImage,
          support_image: product.supportImage,
          custom_fields: product.customFields || {}
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newProduct = {
        ...data,
        customFields: data.custom_fields || {}
      };
      
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          category: updatedProduct.category,
          front_image: updatedProduct.frontImage,
          back_image: updatedProduct.backImage,
          support_image: updatedProduct.supportImage,
          custom_fields: updatedProduct.customFields || {}
        })
        .eq('id', updatedProduct.id)
        .select()
        .single();

      if (error) throw error;

      const updated = {
        ...data,
        customFields: data.custom_fields || {}
      };

      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updated : p));
      return updated;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const searchProductByImage = async (imageFile: File): Promise<Product | null> => {
    try {
      // For now, we'll do a simple comparison based on image similarity
      // In a real implementation, you'd use AI image recognition services
      console.log('Searching for product by image:', imageFile.name);
      
      // Placeholder: return first product with an image for demo
      const productsWithImages = products.filter(p => p.frontImage || p.backImage || p.supportImage);
      return productsWithImages[0] || null;
    } catch (error) {
      console.error('Error searching by image:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCustomFields();
  }, []);

  return {
    products,
    customFields,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProductByImage,
    refetch: () => {
      fetchProducts();
      fetchCustomFields();
    }
  };
};
