import { useState } from 'react';
import { EyeOff, AlertTriangle } from 'lucide-react';
import { ColorTheme } from '../../lib/theme/types';
import { COLOR_PRESETS } from '../../lib/theme/constants';
import { generateColorPalette, checkAccessibility, generateComplementaryColors } from '../../lib/theme/colorUtils';
import ColorPicker from './ColorPicker';
import ThemePreview from './ThemePreview';

interface ThemeEditorProps {
  theme: ColorTheme;
  onChange: (theme: ColorTheme) => void;
  onSave: () => void;
}

export default function ThemeEditor({ theme, onChange, onSave }: ThemeEditorProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'components' | 'preview'>('colors');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showA11yWarnings, setShowA11yWarnings] = useState(true);

  const updateColor = (key: string, value: string) => {
    const palette = generateColorPalette(value);
    onChange({
      ...theme,
      base_colors: {
        ...theme.base_colors,
        [key]: value,
        [`${key}-light`]: palette.light,
        [`${key}-dark`]: palette.dark
      }
    });
  };

  const applyPreset = (presetName: keyof typeof COLOR_PRESETS) => {
    onChange({
      ...theme,
      base_colors: {
        ...theme.base_colors,
        ...COLOR_PRESETS[presetName]
      }
    });
  };

  const checkColorAccessibility = (color: string) => {
    const backgroundCheck = checkAccessibility(color, theme.base_colors.background);
    const textCheck = checkAccessibility(theme.base_colors.text, color);
    
    return {
      isAccessible: backgroundCheck.WCAG_AA && textCheck.WCAG_AA,
      backgroundRatio: backgroundCheck.ratio,
      textRatio: textCheck.ratio
    };
  };

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Theme Editor</h2>
            <p className="text-sm text-gray-500">Customize your theme appearance</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowA11yWarnings(!showA11yWarnings)}
              className={`p-2 rounded-md ${showA11yWarnings ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <EyeOff className="h-5 w-5" />
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Theme
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {(['colors', 'typography', 'components', 'preview'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'colors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(theme.base_colors).map(([key, value]) => {
                const a11yInfo = checkColorAccessibility(value);
                
                return (
                  <div key={key} className="relative">
                    <ColorPicker
                      color={value}
                      onChange={(color) => {
                        updateColor(key, color);
                        setSelectedColor(color);
                      }}
                      label={key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    />
                    {showA11yWarnings && !a11yInfo.isAccessible && (
                      <div className="absolute right-2 top-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      </div>
                    )}
                  </div>
                );
              })}
              <div key="shadow" className="relative">
                <ColorPicker
                  color={theme.base_colors.shadow}
                   onChange={(color) => {
                    updateColor('shadow', color);
                    setSelectedColor(color);
                  }}
                  label="Shadow"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Color Presets</h3>
              <div className="flex space-x-4">
                {Object.entries(COLOR_PRESETS).map(([name, colors]) => (
                  <button
                    key={name}
                    onClick={() => applyPreset(name as keyof typeof COLOR_PRESETS)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    <div className="flex space-x-1">
                      {Object.values(colors).map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-700">{name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-6">
            {/* Typography controls */}
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-6">
            {/* Component-specific theme controls */}
          </div>
        )}

        {activeTab === 'preview' && (
          <ThemePreview theme={theme} />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Color Harmony</h3>
        {selectedColor && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Palette</h4>
              <div className="grid grid-cols-5 gap-2">
                {Object.values(generateColorPalette(selectedColor)).filter(color => typeof color === 'string').map((color, i) => (
                  <div
                    key={i}
                    className="h-8 rounded-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Complementary Colors</h4>
              <div className="grid grid-cols-5 gap-2">
                {Object.values(generateComplementaryColors(selectedColor).analogous).map((color, i) => (
                  <div
                    key={i}
                    className="h-8 rounded-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
