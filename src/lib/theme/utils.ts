import { ColorTheme } from './types';
import tinycolor from 'tinycolor2';

export function generateThemeCSS(theme: ColorTheme): string {
  let css = ':root {\n';
  
  // Base colors with variations
  Object.entries(theme.base_colors).forEach(([key, value]) => {
    const color = tinycolor(value);
    css += `  --color-${key}: ${value};\n`;
    css += `  --color-${key}-light: ${color.lighten(10).toHexString()};\n`;
    css += `  --color-${key}-dark: ${color.darken(10).toHexString()};\n`;
    css += `  --color-${key}-rgb: ${color.toRgb().r}, ${color.toRgb().g}, ${color.toRgb().b};\n`;
  });

  // Typography
  if (theme.typography) {
    css += `  --font-family-headings: ${theme.typography.headings.fontFamily};\n`;
    css += `  --font-family-body: ${theme.typography.body.fontFamily};\n`;
    
    // Font sizes
    Object.entries(theme.typography.headings.sizes || {}).forEach(([key, value]) => {
      css += `  --font-size-${key}: ${value};\n`;
    });
    
    Object.entries(theme.typography.body.sizes || {}).forEach(([key, value]) => {
      css += `  --font-size-${key}: ${value};\n`;
    });
  }

  // Shadows
  Object.entries(theme.shadows || {}).forEach(([key, value]) => {
    css += `  --shadow-${key}: ${value};\n`;
  });

  css += '}\n';

  // Dark mode
  if (theme.dark_mode_values) {
    css += '@media (prefers-color-scheme: dark) {\n  :root {\n';
    Object.entries(theme.dark_mode_values).forEach(([key, value]) => {
      const color = tinycolor(value);
      css += `    --color-${key}: ${value};\n`;
      css += `    --color-${key}-rgb: ${color.toRgb().r}, ${color.toRgb().g}, ${color.toRgb().b};\n`;
    });
    css += '  }\n}\n';
  }

  return css;
}

export function checkAccessibility(color1: string, color2: string): boolean {
  const c1 = tinycolor(color1);
  const c2 = tinycolor(color2);
  const contrast = tinycolor.readability(c1, c2);
  return contrast >= 4.5; // WCAG AA standard
}

export function generateColorPalette(baseColor: string) {
  const color = tinycolor(baseColor);
  return {
    base: color.toHexString(),
    light: color.lighten(10).toHexString(),
    dark: color.darken(10).toHexString(),
    alpha50: color.setAlpha(0.5).toRgbString(),
  };
}