import React from 'react';
import { X } from 'lucide-react';
import { Database } from '../../lib/database.types';

type PopupPromotion = Database['public']['Tables']['popup_promotions']['Row'];

interface PopupPreviewProps {
  popup: PopupPromotion;
  onClose: () => void;
}

export default function PopupPreview({ popup, onClose }: PopupPreviewProps) {
  const positionClasses = {
    center: 'items-center justify-center',
    top: 'items-start pt-20',
    bottom: 'items-end pb-20'
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex ${positionClasses[popup.position]}`}>
      <div className="relative bg-white rounded-lg shadow-xl mx-auto max-w-lg w-full m-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>

        {popup.image_url && (
          <img
            src={popup.image_url}
            alt=""
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )}

        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">{popup.title}</h3>
          {popup.description && (
            <p className="mt-2 text-sm text-gray-500">{popup.description}</p>
          )}

          {popup.cta_text && (
            <div className="mt-4">
              <a
                href={popup.cta_link || '#'}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {popup.cta_text}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}