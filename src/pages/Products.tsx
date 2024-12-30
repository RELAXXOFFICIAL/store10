import React, { useState } from 'react';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import { Plus } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import toast from 'react-hot-toast';

export default function Products() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const { products, createProduct, updateProduct } = useProducts();

  const handleSubmit = async (data: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct, data);
        toast.success('Product updated successfully');
      } else {
        await createProduct(data);
        toast.success('Product created successfully');
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (productId: string) => {
    setEditingProduct(productId);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      {showForm ? (
        <div className="bg-white shadow rounded-lg p-6">
          <ProductForm
            initialData={editingProduct ? products.find(p => p.id === editingProduct) : undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        </div>
      ) : (
        <ProductList onEdit={handleEdit} />
      )}
    </div>
  );
}