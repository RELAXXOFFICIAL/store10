import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ColorPicker from '../../components/theme/ColorPicker';
import ThemePreview from '../../components/theme/ThemePreview';
import { Palette } from 'lucide-react';

export default function Themes() {
  const { currentTheme, themes, setTheme, createTheme } = useTheme();
  const [showForm, setShowForm] = useState(false);

  const defaultTheme = {
    name: '',
    description: '',
    version: 1,
    is_active: false,
    base_colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937'
    }
  };

  const [editingTheme, setEditingTheme] = useState(defaultTheme);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Theme Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Palette className="h-5 w-5 mr-2" />
          Create Theme
        </button>
      </div>

      {/* Theme List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <div key={theme.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium">{theme.name}</h3>
                {theme.description && (
                  <p className="text-sm text-gray-500">{theme.description}</p>
                )}
              </div>
              {theme.is_active ? (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              ) : (
                <button
                  onClick={() => setTheme(theme.id)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Activate
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(theme.base_colors).map(([name, color]) => (
                <div
                  key={name}
                  className="h-12 rounded-md"
                  style={{ backgroundColor: color }}
                  title={`${name}: ${color}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Theme Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold">Create New Theme</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Theme Name
                  </label>
                  <input
                    type="text"
                    value={editingTheme.name}
                    onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={editingTheme.description}
                    onChange={(e) => setEditingTheme({ ...editingTheme, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Colors</h3>
                  {Object.entries(editingTheme.base_colors).map(([key, value]) => (
                    <ColorPicker
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      color={value}
                      onChange={(color) => setEditingTheme({
                        ...editingTheme,
                        base_colors: { ...editingTheme.base_colors, [key]: color }
                      })}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
                <ThemePreview theme={editingTheme as any} />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await createTheme(editingTheme);
                  setShowForm(false);
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Theme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}