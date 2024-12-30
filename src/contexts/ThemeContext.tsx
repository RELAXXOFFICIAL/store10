import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorTheme } from '../lib/theme/types';
import * as themeService from '../services/themeService';
import toast from 'react-hot-toast';

interface ThemeContextType {
  currentTheme: ColorTheme | null;
  themes: ColorTheme[];
  loading: boolean;
  setTheme: (themeId: string) => Promise<void>;
  createTheme: (theme: Partial<ColorTheme>) => Promise<void>;
  updateTheme: (id: string, updates: Partial<ColorTheme>) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme | null>(null);
  const [themes, setThemes] = useState<ColorTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThemes();
  }, []);

  useEffect(() => {
    if (currentTheme) {
      themeService.applyTheme(currentTheme);
    }
  }, [currentTheme]);

  const fetchThemes = async () => {
    try {
      const data = await themeService.fetchThemes();
      setThemes(data);
      const activeTheme = data.find(theme => theme.is_active);
      if (activeTheme) setCurrentTheme(activeTheme);
    } catch (error) {
      toast.error('Failed to fetch themes');
    } finally {
      setLoading(false);
    }
  };

  const setTheme = async (themeId: string) => {
    try {
      const updatedTheme = await themeService.setActiveTheme(themeId);
      setCurrentTheme(updatedTheme);
      await fetchThemes();
      toast.success('Theme updated successfully');
    } catch (error) {
      toast.error('Failed to update theme');
    }
  };

  const createTheme = async (theme: Partial<ColorTheme>) => {
    try {
      await themeService.createTheme(theme);
      await fetchThemes();
      toast.success('Theme created successfully');
    } catch (error) {
      toast.error('Failed to create theme');
    }
  };

  const updateTheme = async (id: string, updates: Partial<ColorTheme>) => {
    try {
      await themeService.updateTheme(id, updates);
      await fetchThemes();
      toast.success('Theme updated successfully');
    } catch (error) {
      toast.error('Failed to update theme');
    }
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      themes,
      loading,
      setTheme,
      createTheme,
      updateTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}