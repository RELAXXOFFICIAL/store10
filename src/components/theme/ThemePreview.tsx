import React from 'react';
import { ColorTheme } from '../../lib/theme/types';

interface ThemePreviewProps {
  theme: ColorTheme;
}

export default function ThemePreview({ theme }: ThemePreviewProps) {
  return (
    <div className="space-y-8">
      {/* Color Swatches */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(theme.base_colors).map(([name, color]) => (
            <div key={name} className="space-y-2">
              <div className="relative">
                <div 
                  className="h-20 rounded-lg shadow-md" 
                  style={{ backgroundColor: color }}
                />
                <div 
                  className="h-6 absolute bottom-0 w-full rounded-b-lg bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1"
                >
                  <p className="text-xs font-medium text-gray-900">{name}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{color}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Preview */}
      {theme.typography && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Typography</h3>
          <div className="space-y-6 bg-white rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              <h1 style={{ fontFamily: theme.typography.headings.fontFamily }} className="text-4xl font-bold">
                Heading 1
              </h1>
              <h2 style={{ fontFamily: theme.typography.headings.fontFamily }} className="text-3xl font-bold">
                Heading 2
              </h2>
              <h3 style={{ fontFamily: theme.typography.headings.fontFamily }} className="text-2xl font-bold">
                Heading 3
              </h3>
            </div>
            
            <div className="space-y-2">
              <p style={{ fontFamily: theme.typography.body.fontFamily }} className="text-base">
                Body text (Base): The quick brown fox jumps over the lazy dog.
              </p>
              <p style={{ fontFamily: theme.typography.body.fontFamily }} className="text-sm">
                Body text (Small): The quick brown fox jumps over the lazy dog.
              </p>
              <p style={{ fontFamily: theme.typography.body.fontFamily }} className="text-lg">
                Body text (Large): The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gradient Preview */}
      {theme.gradients && theme.gradients.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gradients</h3>
          <div className="grid grid-cols-2 gap-4">
            {theme.gradients.map((gradient) => (
              <div key={gradient.id} className="space-y-2">
                <div 
                  className="h-20 rounded-lg shadow-md"
                  style={{
                    background: `linear-gradient(to right, ${
                      gradient.stops.map(stop => `${stop.color} ${stop.position}%`).join(', ')
                    })`
                  }}
                />
                <p className="text-sm font-medium text-gray-700">{gradient.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shadow Preview */}
      {theme.shadows && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Shadows</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(theme.shadows).map(([name, value]) => (
              <div
                key={name}
                className="h-20 bg-white rounded-lg p-4 flex items-center justify-center"
                style={{ boxShadow: value }}
              >
                <p className="text-sm font-medium text-gray-700">{name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}