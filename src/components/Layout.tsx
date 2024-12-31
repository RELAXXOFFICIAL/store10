import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Package, Truck, LogOut, Palette, Megaphone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/products', icon: Package, label: 'Products' },
  { path: '/orders', icon: Truck, label: 'Orders' },
  { path: '/themes', icon: Palette, label: 'Themes' },
  { path: '/promotions', icon: Megaphone, label: 'Promotions' },
];

export default function Layout() {
  const { logout } = useAuth();
  const { currentTheme } = useTheme();
  const location = useLocation();

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
        className="shadow-md fixed w-64 h-full"
        style={{
          backgroundColor: currentTheme?.base_colors?.background || 'white',
        }}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold" style={{ color: currentTheme?.base_colors?.text || 'black' }}>Admin Panel</h1>
        </div>
        <ul className="mt-6">
          {navItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center px-6 py-3 hover:bg-gray-100 ${
                  location.pathname === path ? 'bg-gray-100' : ''
                }`}
                style={{ color: currentTheme?.base_colors?.text || 'black' }}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => logout()}
              className="w-full flex items-center px-6 py-3 hover:bg-gray-100"
              style={{ color: currentTheme?.base_colors?.text || 'black' }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
