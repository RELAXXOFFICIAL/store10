import React, { useState } from 'react';
import { Percent, MessageSquare } from 'lucide-react';
import { usePromotions } from '../../hooks/usePromotions';
import DiscountForm from '../../components/promotions/DiscountForm';
import PopupForm from '../../components/promotions/PopupForm';
import PopupPreview from '../../components/promotions/PopupPreview';
import toast from 'react-hot-toast';

export default function Promotions() {
  const [activeTab, setActiveTab] = useState<'discounts' | 'popups'>('discounts');
  const [showForm, setShowForm] = useState(false);
  const [previewPopup, setPreviewPopup] = useState(null);
  
  const {
    discounts,
    popups,
    loading,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    createPopup,
    updatePopup,
    deletePopup
  } = usePromotions();

  const handleDiscountSubmit = async (data) => {
    try {
      await createDiscount(data);
      toast.success('Discount created successfully');
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to create discount');
    }
  };

  const handlePopupSubmit = async (data) => {
    try {
      await createPopup(data);
      toast.success('Popup created successfully');
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to create popup');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Promotional Content</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Add {activeTab === 'discounts' ? 'Discount' : 'Popup'}
        </button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('discounts')}
            className={`${
              activeTab === 'discounts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Percent className="h-5 w-5 mr-2" />
            Product Discounts
          </button>
          <button
            onClick={() => setActiveTab('popups')}
            className={`${
              activeTab === 'popups'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Popup Promotions
          </button>
        </nav>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            {activeTab === 'discounts' ? (
              <DiscountForm onSubmit={handleDiscountSubmit} />
            ) : (
              <PopupForm
                onSubmit={handlePopupSubmit}
                onPreview={setPreviewPopup}
              />
            )}
          </div>
        </div>
      )}

      {previewPopup && (
        <PopupPreview
          popup={previewPopup}
          onClose={() => setPreviewPopup(null)}
        />
      )}

      {/* List content based on active tab */}
      {activeTab === 'discounts' ? (
        <div className="bg-white shadow rounded-lg">
          {/* Discount list implementation */}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          {/* Popup list implementation */}
        </div>
      )}
    </div>
  );
}