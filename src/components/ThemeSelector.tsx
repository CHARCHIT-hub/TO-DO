import type { Theme } from '../types';
import { themes } from '../constants';
import { Palette } from 'lucide-react';

interface ThemeSelectorProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeSelector({ theme, onThemeChange, isOpen, onClose }: ThemeSelectorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative glass rounded-3xl p-6 w-full max-w-md animate-scale-in"
        style={{ background: theme.cardBg }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Palette size={20} />
            <h3 className="text-lg font-semibold" style={{ color: theme.textPrimary }}>Choose Theme</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-white/10 transition-colors"
            style={{ color: theme.textSecondary }}
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
          {themes.map((t, index) => (
            <button
              key={t.name}
              onClick={() => { onThemeChange(t); onClose(); }}
              className={`theme-dot rounded-2xl p-4 text-left relative overflow-hidden cursor-pointer group ${
                t.name === theme.name ? 'ring-2 ring-white/30' : ''
              }`}
              style={{
                background: t.bgGradient,
                backgroundSize: '200% 200%',
                animation: t.name === theme.name ? `gradient-shift 4s ease infinite ${index * 0.1}s` : undefined,
              }}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              <div className="relative z-10">
                <div className="flex gap-1.5 mb-2">
                  <div className="w-4 h-4 rounded-full" style={{ background: t.primary }} />
                  <div className="w-4 h-4 rounded-full" style={{ background: t.secondary }} />
                  <div className="w-4 h-4 rounded-full" style={{ background: t.accent }} />
                </div>
                <span className="text-xs font-medium text-white/90">{t.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
