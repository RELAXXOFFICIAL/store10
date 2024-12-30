import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { checkAccessibility } from '../../lib/theme/utils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  showAccessibility?: boolean;
  contrastWith?: string;
  presetColors?: string[];
}

export default function ColorPicker({
  color,
  onChange,
  label,
  showAccessibility = false,
  contrastWith,
  presetColors = []
}: ColorPickerProps) {
  const isAccessible = showAccessibility && contrastWith 
    ? checkAccessibility(color, contrastWith)
    : null;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="space-y-4">
        <HexColorPicker color={color} onChange={onChange} />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-full border border-gray-200"
              style={{ backgroundColor: color }}
            />
            <input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {showAccessibility && contrastWith && (
            <span className={`text-sm ${isAccessible ? 'text-green-600' : 'text-red-600'}`}>
              {isAccessible ? 'WCAG AA Compliant' : 'Not Accessible'}
            </span>
          )}
        </div>

        {presetColors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                className="w-6 h-6 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{ backgroundColor: presetColor }}
                onClick={() => onChange(presetColor)}
                aria-label={`Select color ${presetColor}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}