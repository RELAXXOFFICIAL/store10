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
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { currentTheme } = useTheme();

  const bgColor = currentTheme?.base_colors?.primary || 'bg-white';
  const textColor = currentTheme?.base_colors?.text || 'text-gray-700';

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentTheme?.base_colors?.background }}>
      <nav className={`shadow-md fixed w-64 h-full ${bgColor}`}>
        <div className="p-4">
          <h1 className={`text-xl font-bold ${textColor}`}>Admin Panel</h1>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
        <ul className="mt-6">
          {navItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center px-6 py-3 ${textColor} hover:bg-gray-100 ${
                  location.pathname === path ? 'bg-gray-100' : ''
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => signOut()}
              className={`w-full flex items-center px-6 py-3 ${textColor} hover:bg-gray-100`}
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
