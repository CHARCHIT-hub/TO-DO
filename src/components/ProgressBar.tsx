import type { Theme } from '../types';

interface ProgressBarProps {
  completed: number;
  total: number;
  theme: Theme;
}

export default function ProgressBar({ completed, total, theme }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-3xl font-black tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {percentage}%
          </span>
          <span style={{ color: theme.textSecondary, fontSize: '13px' }}>
            {completed}/{total} tasks done
          </span>
        </div>
        {percentage === 100 && total > 0 && (
          <span className="text-sm animate-pulse">🎉 All done!</span>
        )}
      </div>

      <div
        className="h-2.5 rounded-full overflow-hidden relative"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="h-full rounded-full relative animate-progress-fill"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`,
            backgroundSize: '200% 100%',
            animation: 'gradient-shift 3s ease infinite',
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
