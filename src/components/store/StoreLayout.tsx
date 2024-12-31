import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CartDrawer from '../cart/CartDrawer';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';

export default function StoreLayout() {
  const { isAuthenticated, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const location = useLocation();


  const handleSignOut = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: currentTheme
          ? `linear-gradient(to bottom right, ${currentTheme.base_colors.primary}, ${currentTheme.base_colors.secondary})`
          : 'white',
        color: currentTheme?.base_colors?.text || 'black',
      }}
    >
      <nav
        className="shadow-sm"
        style={{
          backgroundColor: currentTheme?.base_colors?.background || 'white',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className={`text-xl font-bold ${location.pathname === '/' ? 'underline' : ''}`} style={{ color: currentTheme?.base_colors?.text || 'black' }}>
                Store
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="text-gray-600 hover:text-gray-900"
              >
                <ShoppingCart className="h-6 w-6" />
              </button>
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <User className="h-6 w-6" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Account
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
