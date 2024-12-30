import React from 'react';
import { ThemeValidationSchema } from '../../lib/theme/validators';
import ColorPicker from './ColorPicker';
import ThemePreview from './ThemePreview';
import { useThemeForm } from '../../hooks/useThemeForm';

interface ThemeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ThemeForm({ onSuccess, onCancel }: ThemeFormProps) {
  const { defaultTheme, loading, handleSubmit } = useThemeForm(onSuccess);
  const [theme, setTheme] = React.useState<ThemeValidationSchema>(defaultTheme);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Theme Name
          </label>
          <input
            type="text"
            value={theme.name}
            onChange={(e) => setTheme({ ...theme, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={theme.description || ''}
            onChange={(e) => setTheme({ ...theme, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Colors</h3>
          {Object.entries(theme.base_colors).map(([key, value]) => (
            <ColorPicker
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              color={value}
              onChange={(color) => setTheme({
                ...theme,
                base_colors: { ...theme.base_colors, [key]: color }
              })}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
        <ThemePreview theme={theme as any} />
      </div>

      <div className="col-span-2 flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={() => handleSubmit(theme)}
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Creating...' : 'Create Theme'}
        </button>
      </div>
    </div>
  );
}