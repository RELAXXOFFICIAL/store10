import { useState } from 'react';
import { ThemeValidationSchema, themeSchema } from '../lib/theme/validators';
import { createTheme, updateTheme } from '../lib/theme/api';
import toast from 'react-hot-toast';

export function useThemeForm(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const defaultTheme: ThemeValidationSchema = {
    name: '',
    description: '',
    version: 1,
    is_active: false,
    base_colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937'
    }
  };

  const handleSubmit = async (data: ThemeValidationSchema) => {
    try {
      setLoading(true);
      const validatedData = themeSchema.parse(data);
      await createTheme(validatedData);
      toast.success('Theme created successfully');
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create theme');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    defaultTheme,
    loading,
    handleSubmit
  };
}