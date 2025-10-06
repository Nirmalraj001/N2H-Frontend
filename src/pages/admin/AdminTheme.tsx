import { useState, useEffect } from 'react';
import { Palette, Type, Square, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ThemeSettings } from '../../types';
import { themeService } from '../../services/themeService';
import { useAppDispatch } from '../../store/hooks';
import { showToast } from '../../store/slices/uiSlice';

export const AdminTheme = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const settings = await themeService.getTheme();
      setTheme(settings);
    } catch (error) {
      dispatch(showToast({ message: 'Failed to load theme settings', type: 'error' }));
    }
  };

  const handleChange = (field: keyof ThemeSettings, value: string | boolean) => {
    if (!theme) return;
    const updated = { ...theme, [field]: value };
    setTheme(updated);
    if (previewMode) {
      themeService.applyTheme(updated);
    }
  };

  const handleSave = async () => {
    if (!theme) return;
    setLoading(true);
    try {
      const updated = await themeService.updateTheme(theme);
      themeService.applyTheme(updated);
      dispatch(showToast({ message: 'Theme settings saved successfully', type: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: 'Failed to save theme settings', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewToggle = () => {
    if (!theme) return;
    if (!previewMode) {
      themeService.applyTheme(theme);
    } else {
      loadTheme();
    }
    setPreviewMode(!previewMode);
  };

  if (!theme) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Theme Management</h1>
          <p className="text-gray-600">Customize the appearance of your application</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePreviewToggle}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Colors</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme Mode</label>
              <Select
                value={theme.mode}
                onChange={(e) => handleChange('mode', e.target.value)}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  placeholder="#10B981"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={theme.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={theme.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  placeholder="#1F2937"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Type className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Typography</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
              <Select
                value={theme.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                options={[
                  { value: 'Inter, system-ui, sans-serif', label: 'Inter' },
                  { value: 'Roboto, sans-serif', label: 'Roboto' },
                  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
                  { value: 'Lato, sans-serif', label: 'Lato' },
                  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
                  { value: 'Poppins, sans-serif', label: 'Poppins' },
                  { value: 'Georgia, serif', label: 'Georgia' },
                  { value: 'Times New Roman, serif', label: 'Times New Roman' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Font Size</label>
              <Select
                value={theme.baseFontSize}
                onChange={(e) => handleChange('baseFontSize', e.target.value)}
                options={[
                  { value: '14px', label: '14px (Small)' },
                  { value: '16px', label: '16px (Default)' },
                  { value: '18px', label: '18px (Large)' },
                  { value: '20px', label: '20px (Extra Large)' },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Square className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Button Styles</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
              <Select
                value={theme.buttonRoundness}
                onChange={(e) => handleChange('buttonRoundness', e.target.value)}
                options={[
                  { value: '0px', label: 'None (Sharp)' },
                  { value: '4px', label: '4px (Slightly Rounded)' },
                  { value: '8px', label: '8px (Rounded)' },
                  { value: '12px', label: '12px (Very Rounded)' },
                  { value: '9999px', label: 'Full (Pill Shape)' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
              <Select
                value={theme.buttonPadding}
                onChange={(e) => handleChange('buttonPadding', e.target.value)}
                options={[
                  { value: '8px 16px', label: 'Small' },
                  { value: '12px 24px', label: 'Medium' },
                  { value: '16px 32px', label: 'Large' },
                ]}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={theme.buttonShadow}
                  onChange={(e) => handleChange('buttonShadow', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Enable Shadow</span>
              </label>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-3">Button Preview:</p>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Primary Button
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Secondary Button
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Outline Button
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: theme.backgroundColor }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: theme.textColor, fontFamily: theme.fontFamily }}>
                Sample Heading
              </h3>
              <p className="mb-3" style={{ color: theme.textColor, fontFamily: theme.fontFamily, fontSize: theme.baseFontSize }}>
                This is how your text will appear with the current settings. The quick brown fox jumps over the lazy dog.
              </p>
              <div className="flex gap-2">
                <button
                  style={{
                    backgroundColor: theme.primaryColor,
                    borderRadius: theme.buttonRoundness,
                    padding: theme.buttonPadding,
                    color: '#FFFFFF',
                    boxShadow: theme.buttonShadow ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
                  }}
                  className="font-medium"
                >
                  Primary
                </button>
                <button
                  style={{
                    backgroundColor: theme.secondaryColor,
                    borderRadius: theme.buttonRoundness,
                    padding: theme.buttonPadding,
                    color: '#FFFFFF',
                    boxShadow: theme.buttonShadow ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
                  }}
                  className="font-medium"
                >
                  Secondary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
