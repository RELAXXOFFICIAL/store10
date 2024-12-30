import { ColorTheme } from './types';

export const DEFAULT_THEME: ColorTheme = {
  id: 'default',
  name: 'Default Theme',
  version: 1,
  is_active: true,
  base_colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6',
    background: '#FFFFFF',
    text: '#1F2937',
    'primary-light': '#60A5FA',
    'primary-dark': '#2563EB',
    'secondary-light': '#34D399',
    'secondary-dark': '#059669',
    'accent-light': '#A78BFA',
    'accent-dark': '#7C3AED',
    'background-alt': '#F3F4F6',
    'text-light': '#6B7280',
    'text-dark': '#111827',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  semantic_colors: {
    'button-primary': 'var(--color-primary)',
    'button-primary-hover': 'var(--color-primary-dark)',
    'button-secondary': 'var(--color-secondary)',
    'button-secondary-hover': 'var(--color-secondary-dark)',
    'input-border': 'var(--color-text-light)',
    'input-border-focus': 'var(--color-primary)',
    'card-background': 'var(--color-background)',
    'card-border': 'var(--color-text-light)',
    'header-background': 'var(--color-background-alt)',
    'sidebar-background': 'var(--color-background)',
    'sidebar-text': 'var(--color-text)',
    'sidebar-text-hover': 'var(--color-primary)'
  },
  typography: {
    headings: {
      fontFamily: 'Inter, system-ui, sans-serif',
      weights: [500, 600, 700],
      sizes: {
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.75rem',
        h4: '1.5rem',
        h5: '1.25rem',
        h6: '1rem'
      }
    },
    body: {
      fontFamily: 'Inter, system-ui, sans-serif',
      weights: [400, 500],
      sizes: {
        base: '1rem',
        sm: '0.875rem',
        lg: '1.125rem'
      }
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  },
  gradients: [
    {
      id: 'primary',
      name: 'Primary Gradient',
      stops: [
        { color: '#3B82F6', position: 0 },
        { color: '#2563EB', position: 100 }
      ]
    },
    {
      id: 'secondary',
      name: 'Secondary Gradient',
      stops: [
        { color: '#10B981', position: 0 },
        { color: '#059669', position: 100 }
      ]
    }
  ],
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

export const COLOR_PRESETS = {
  blue: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6'
  },
  green: {
    primary: '#10B981',
    secondary: '#3B82F6',
    accent: '#F59E0B'
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#EC4899',
    accent: '#3B82F6'
  }
};

export const SEMANTIC_COLOR_MAPPING = {
  button: ['primary', 'secondary', 'accent'],
  input: ['border', 'background', 'text'],
  card: ['background', 'border', 'shadow'],
  text: ['primary', 'secondary', 'muted']
};

export const CONTRAST_RATIO_REQUIREMENTS = {
  normal: 4.5,
  large: 3
};