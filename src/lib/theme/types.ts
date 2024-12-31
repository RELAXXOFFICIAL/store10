export interface ColorTheme {
  id: string;
  name: string;
  description?: string;
  version: number;
  is_active: boolean;
  base_colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    shadow: string;
    [key: string]: string;
  };
  gradients?: Array<{
    id: string;
    name: string;
    stops: Array<{
      color: string;
      position: number;
    }>;
  }>;
  typography?: {
    headings: {
      fontFamily: string;
      weights: number[];
      sizes: {
        h1: string;
        h2: string;
        h3: string;
        h4: string;
        h5: string;
        h6: string;
      };
    };
    body: {
      fontFamily: string;
      weights: number[];
      sizes: {
        base: string;
        sm: string;
        lg: string;
      };
    };
  };
  shadows?: {
    small: string;
    medium: string;
    large: string;
    [key: string]: string;
  };
  dark_mode_values?: {
    [key: string]: string;
  };
  breakpoints?: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: {
    [key: string]: string;
  };
  is_preset: boolean;
}
