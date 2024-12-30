// Check if color contrast meets WCAG standards
export function checkColorContrast(color1: string, color2: string): boolean {
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const parseColor = (color: string) => {
    const hex = color.replace('#', '');
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16)
    };
  };

  const color1Values = parseColor(color1);
  const color2Values = parseColor(color2);

  const l1 = getLuminance(color1Values.r, color1Values.g, color1Values.b);
  const l2 = getLuminance(color2Values.r, color2Values.g, color2Values.b);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return ratio >= 4.5; // WCAG AA standard for normal text
}

// Generate aria-label for common UI patterns
export function generateAriaLabel(type: 'button' | 'link' | 'input', context: string): string {
  return `${type} ${context}`.trim();
}