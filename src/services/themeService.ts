import { ColorTheme } from '../lib/theme/types';
import { generateThemeCSS } from '../lib/theme/utils';

export async function fetchThemes() {
  console.log('fetchThemes');
  return [{
    id: '1',
    name: 'Default Theme',
    is_active: true,
    version: 1,
    base_colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745',
      background: '#f8f9fa',
      text: '#343a40',
    },
  }];
}

export async function createTheme(theme: Partial<ColorTheme>) {
  console.log('createTheme', theme);
  return { ...theme, id: '1', is_active: false, version: 1, base_colors: { primary: '#007bff', secondary: '#6c757d', accent: '#28a745', background: '#f8f9fa', text: '#343a40' } };
}

export async function updateTheme(id: string, updates: Partial<ColorTheme>) {
  console.log('updateTheme', id, updates);
  return { ...updates, id };
}

export async function setActiveTheme(id: string) {
    console.log('setActiveTheme', id);
    return { id, is_active: true, name: 'Default Theme', version: 1, base_colors: { primary: '#007bff', secondary: '#6c757d', accent: '#28a745', background: '#f8f9fa', text: '#343a40' } };
}

export function applyTheme(theme: ColorTheme) {
  const css = generateThemeCSS(theme);
  
  // Create or update style element
  let styleEl = document.getElementById('theme-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'theme-styles';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}
