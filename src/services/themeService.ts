import { ThemeSettings } from '../types';

const THEME_STORAGE_KEY = 'app_theme_settings';

const defaultTheme: ThemeSettings = {
  id: '1',
  mode: 'light',
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  fontFamily: 'Inter, system-ui, sans-serif',
  baseFontSize: '16px',
  buttonRoundness: '8px',
  buttonShadow: true,
  buttonPadding: '12px 24px',
  updatedAt: new Date().toISOString(),
};

export const themeService = {
  getTheme: async (): Promise<ThemeSettings> => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return defaultTheme;
    } catch (error) {
      return defaultTheme;
    }
  },

  updateTheme: async (settings: Partial<ThemeSettings>): Promise<ThemeSettings> => {
    try {
      const current = await themeService.getTheme();
      const updated = {
        ...current,
        ...settings,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      throw new Error('Failed to update theme settings');
    }
  },

  applyTheme: (settings: ThemeSettings) => {
    const root = document.documentElement;

    root.style.setProperty('--color-primary', settings.primaryColor);
    root.style.setProperty('--color-secondary', settings.secondaryColor);
    root.style.setProperty('--color-background', settings.backgroundColor);
    root.style.setProperty('--color-text', settings.textColor);
    root.style.setProperty('--font-family', settings.fontFamily);
    root.style.setProperty('--font-size-base', settings.baseFontSize);
    root.style.setProperty('--button-roundness', settings.buttonRoundness);
    root.style.setProperty('--button-padding', settings.buttonPadding);

    if (settings.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },
};
