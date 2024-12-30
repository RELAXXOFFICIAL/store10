import { supabase } from '../lib/supabase';
import { ColorTheme } from '../lib/theme/types';
import { generateThemeCSS } from '../lib/theme/utils';

export async function fetchThemes() {
  const { data, error } = await supabase
    .from('color_themes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTheme(theme: Partial<ColorTheme>) {
  const { data, error } = await supabase
    .from('color_themes')
    .insert([theme])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTheme(id: string, updates: Partial<ColorTheme>) {
  const { data, error } = await supabase
    .from('color_themes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function setActiveTheme(id: string) {
  // First, deactivate all themes
  const { error: deactivateError } = await supabase
    .from('color_themes')
    .update({ is_active: false, 'Content-Type': 'application/json' })
    .neq('id', id);

  if (deactivateError) throw deactivateError;

  // Then, activate the selected theme
  const { data, error } = await supabase
    .from('color_themes')
    .update({ is_active: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
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
