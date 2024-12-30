import { z } from 'zod';

export const colorSchema = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color');

export const baseColorsSchema = z.object({
  primary: colorSchema,
  secondary: colorSchema,
  accent: colorSchema,
  background: colorSchema,
  text: colorSchema
});

export const gradientStopSchema = z.object({
  color: colorSchema,
  position: z.number().min(0).max(100)
});

export const gradientSchema = z.object({
  id: z.string(),
  name: z.string(),
  stops: z.array(gradientStopSchema).min(2)
});

export const themeSchema = z.object({
  name: z.string().min(1, 'Theme name is required'),
  description: z.string().optional(),
  version: z.number().default(1),
  is_active: z.boolean().default(false),
  base_colors: baseColorsSchema,
  gradients: z.array(gradientSchema).optional(),
});

export type ThemeValidationSchema = z.infer<typeof themeSchema>;