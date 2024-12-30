import React from 'react';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FocusTrap from '../common/FocusTrap';
import VisuallyHidden from '../common/VisuallyHidden';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total, loading } = useCart();
  const { session } = useAuth();
  const navigate = useNavigate();

  useKeyboardNavigation({
    onEscape: onClose
  });

  const handleCheckout = () => {
    if (!session) {
      toast.error('Please sign in to checkout');
      navigate('/login');
      onClose();
      return;
    }
    navigate('/checkout');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
        role="button"
        aria-label="Close cart"
        tabIndex={0}
      />
      
      <FocusTrap active={isOpen}>
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 id="cart-title" className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                  <button
                    onClick={onClose}
                    className="ml-3 h-7 flex items-center justify-center"
                    aria-label="Close cart"
                  >
                    <X className="h-6 w-6 text-gray-400" />
                  </button>
                </div>

                {/* Rest of the component remains the same */}
              </div>
            </div>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}