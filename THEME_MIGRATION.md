# Theme Settings Database Migration

This document describes the database migration needed for the theme management feature when Supabase becomes available.

## Migration SQL

```sql
/*
  # Create theme settings table

  1. New Tables
    - `theme_settings`
      - `id` (uuid, primary key)
      - `mode` (text) - light or dark theme mode
      - `primary_color` (text) - primary color hex code
      - `secondary_color` (text) - secondary color hex code
      - `background_color` (text) - background color hex code
      - `text_color` (text) - text color hex code
      - `font_family` (text) - font family name
      - `base_font_size` (text) - base font size
      - `button_roundness` (text) - button border radius
      - `button_shadow` (boolean) - whether buttons have shadow
      - `button_padding` (text) - button padding value
      - `updated_at` (timestamptz) - last update timestamp
      - `created_at` (timestamptz) - creation timestamp

  2. Security
    - Enable RLS on `theme_settings` table
    - Add policy for authenticated admin users to read theme settings
    - Add policy for authenticated admin users to update theme settings
*/

CREATE TABLE IF NOT EXISTS theme_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mode text NOT NULL DEFAULT 'light',
  primary_color text NOT NULL DEFAULT '#3B82F6',
  secondary_color text NOT NULL DEFAULT '#10B981',
  background_color text NOT NULL DEFAULT '#FFFFFF',
  text_color text NOT NULL DEFAULT '#1F2937',
  font_family text NOT NULL DEFAULT 'Inter, system-ui, sans-serif',
  base_font_size text NOT NULL DEFAULT '16px',
  button_roundness text NOT NULL DEFAULT '8px',
  button_shadow boolean NOT NULL DEFAULT true,
  button_padding text NOT NULL DEFAULT '12px 24px',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read theme settings"
  ON theme_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can update theme settings"
  ON theme_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

INSERT INTO theme_settings (id, mode, primary_color, secondary_color, background_color, text_color)
VALUES ('00000000-0000-0000-0000-000000000001', 'light', '#3B82F6', '#10B981', '#FFFFFF', '#1F2937')
ON CONFLICT (id) DO NOTHING;
```

## Implementation Notes

1. Currently, theme settings are stored in localStorage as a fallback
2. When the database becomes available, update `src/services/themeService.ts` to use the Supabase API
3. The theme settings will apply globally across the application
4. Admin users can manage theme settings from `/admin/theme`
5. Theme changes can be previewed before saving
