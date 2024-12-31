import { useState } from 'react';
import { usePromotions, PopupPromotion } from '../../hooks/usePromotions';
import PopupPreview from '../../components/promotions/PopupPreview';

const Promotions = () => {
  const { popups } = usePromotions();
  const [previewPopup, setPreviewPopup] = useState<PopupPromotion | null>(null);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Current Popups</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {popups.map((popup: PopupPromotion) => (
              <tr key={popup.id}>
                <td className="px-6 py-4 whitespace-nowrap">{popup.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{popup.start_date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{popup.end_date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    popup.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {popup.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <button 
                    onClick={() => setPreviewPopup(popup)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    Preview
                  </button>
                  <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button className="text-red-600 hover:text-red-900 ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    {previewPopup && (
      <PopupPreview popup={previewPopup} onClose={() => setPreviewPopup(null)} />
    )}
    </div>
  );
};

export default Promotions;
