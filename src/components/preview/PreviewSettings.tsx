import React from 'react';
import { Moon, Sun, CreditCard, Globe, Palette } from 'lucide-react';
import { ColorTheme, FeatureType } from '@/services/generator/types';

interface PreviewSettingsProps {
  isDarkMode: boolean;
  onDarkModeChange: (value: boolean) => void;
  showPayment: boolean;
  onShowPaymentChange: (value: boolean) => void;
  theme: ColorTheme;
  onThemeChange: (theme: ColorTheme) => void;
  features: FeatureType[];
}

const presetThemes: { name: string; theme: ColorTheme }[] = [
  { name: 'Orange', theme: { primary: '#FF5722', secondary: '#FFC107', accent: '#4CAF50' } },
  { name: 'Blue', theme: { primary: '#3F51B5', secondary: '#FF4081', accent: '#00BCD4' } },
  { name: 'Purple', theme: { primary: '#9C27B0', secondary: '#E91E63', accent: '#03A9F4' } },
  { name: 'Green', theme: { primary: '#4CAF50', secondary: '#8BC34A', accent: '#FF9800' } },
  { name: 'Teal', theme: { primary: '#009688', secondary: '#00BCD4', accent: '#FF5722' } },
];

export function PreviewSettings({
  isDarkMode,
  onDarkModeChange,
  showPayment,
  onShowPaymentChange,
  theme,
  onThemeChange,
  features,
}: PreviewSettingsProps) {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-3">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-foreground">Preview Settings</h3>
      </div>

      <div className="space-y-4">
        {/* Theme Colors */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Theme Color</p>
          <div className="flex gap-2">
            {presetThemes.map(preset => (
              <button
                key={preset.name}
                onClick={() => onThemeChange(preset.theme)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  theme.primary === preset.theme.primary 
                    ? 'border-white scale-110' 
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: preset.theme.primary }}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isDarkMode ? (
              <Moon className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Sun className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm">Dark Mode</span>
          </div>
          <button
            onClick={() => onDarkModeChange(!isDarkMode)}
            className={`w-10 h-6 rounded-full transition-colors relative ${
              isDarkMode ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isDarkMode ? 'left-5' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Payment Toggle */}
        {features.includes('payment') && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Payment Flow</span>
            </div>
            <button
              onClick={() => onShowPaymentChange(!showPayment)}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                showPayment ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  showPayment ? 'left-5' : 'left-1'
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
