import tinycolor from 'tinycolor2';
import { CONTRAST_RATIO_REQUIREMENTS } from './constants';

export function generateColorPalette(baseColor: string) {
  const color = tinycolor(baseColor);
  const hsl = color.toHsl();

  return {
    base: color.toHexString(),
    light: tinycolor({ ...hsl, l: Math.min(hsl.l + 0.15, 1) }).toHexString(),
    lighter: tinycolor({ ...hsl, l: Math.min(hsl.l + 0.3, 1) }).toHexString(),
    dark: tinycolor({ ...hsl, l: Math.max(hsl.l - 0.15, 0) }).toHexString(),
    darker: tinycolor({ ...hsl, l: Math.max(hsl.l - 0.3, 0) }).toHexString(),
    alpha: {
      10: color.setAlpha(0.1).toRgbString(),
      20: color.setAlpha(0.2).toRgbString(),
      50: color.setAlpha(0.5).toRgbString(),
      80: color.setAlpha(0.8).toRgbString()
    }
  };
}

export function generateComplementaryColors(baseColor: string) {
  const color = tinycolor(baseColor);
  const complement = color.complement();
  
  return {
    complement: complement.toHexString(),
    triadic: color.triad().map(c => c.toHexString()),
    tetrad: color.tetrad().map(c => c.toHexString()),
    analogous: color.analogous().map(c => c.toHexString()),
    splitcomplement: color.splitcomplement().map(c => c.toHexString())
  };
}

export function checkAccessibility(foreground: string, background: string) {
  const contrast = tinycolor.readability(foreground, background);
  
  return {
    ratio: contrast,
    normalText: contrast >= CONTRAST_RATIO_REQUIREMENTS.normal,
    largeText: contrast >= CONTRAST_RATIO_REQUIREMENTS.large,
    WCAG_AA: contrast >= CONTRAST_RATIO_REQUIREMENTS.normal,
    WCAG_AAA: contrast >= 7
  };
}

export function generateThemeVariables(colors: Record<string, string>) {
  return Object.entries(colors).reduce((acc, [key, value]) => {
    const color = tinycolor(value);
    const palette = generateColorPalette(value);
    
    acc[`--color-${key}`] = value;
    acc[`--color-${key}-rgb`] = color.toRgb().join(',');
    acc[`--color-${key}-light`] = palette.light;
    acc[`--color-${key}-lighter`] = palette.lighter;
    acc[`--color-${key}-dark`] = palette.dark;
    acc[`--color-${key}-darker`] = palette.darker;
    
    return acc;
  }, {} as Record<string, string>);
}

export function generateA11yReport(colors: Record<string, string>) {
  const report: Record<string, any> = {};
  
  Object.entries(colors).forEach(([key, value]) => {
    report[key] = {
      onWhite: checkAccessibility(value, '#FFFFFF'),
      onBlack: checkAccessibility(value, '#000000'),
      asBackground: {
        withWhiteText: checkAccessibility('#FFFFFF', value),
        withBlackText: checkAccessibility('#000000', value)
      }
    };
  });
  
  return report;
}