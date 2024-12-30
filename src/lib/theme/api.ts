import { supabase } from '../supabase';
import { ThemeValidationSchema } from './validators';
import { handleError } from '../utils/errorHandling';

export async function createTheme(theme: ThemeValidationSchema) {
  try {
    const { data, error } = await supabase
      .from('color_themes')
      .insert([theme])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function updateTheme(id: string, updates: Partial<ThemeValidationSchema>) {
  try {
    const { data, error } = await supabase
      .from('color_themes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function fetchThemes() {
  try {
    const { data, error } = await supabase
      .from('color_themes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function setActiveTheme(id: string) {
  try {
    // First, deactivate all themes
    const { error: deactivateError } = await supabase
      .from('color_themes')
      .update({ is_active: false })
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
  } catch (error) {
    throw handleError(error);
  }
}