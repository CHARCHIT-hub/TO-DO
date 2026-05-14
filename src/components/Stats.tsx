import { useState } from 'react';
import type { Todo } from '../types';
import type { Theme } from '../types';
import type { FilterType } from '../types';


interface StatsProps {
  todos: Todo[];
  theme: Theme;
  onClearCompleted: () => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function Stats({ todos, theme, onClearCompleted, filter, onFilterChange }: StatsProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const completedCount = todos.filter(t => t.completed).length;

  const stats = [
    {
      label: 'Total',
      value: todos.length,
      icon: '📋',
      color: theme.primary,
    },
    {
      label: 'Active',
      value: todos.filter(t => !t.completed).length,
      icon: '⚡',
      color: '#48DBFB',
    },
    {
      label: 'Done',
      value: completedCount,
      icon: '✅',
      color: '#48DB80',
    },
  ];

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Done' },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-3 text-center"
            style={{
              background: theme.cardBg,
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div className="text-lg mb-1">{stat.icon}</div>
            <div
              className="text-xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div style={{ color: theme.textSecondary, fontSize: '11px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-2">
        <div
          className="flex rounded-xl p-1"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f.key ? 'shadow-lg' : ''
              }`}
              style={{
                background: filter === f.key ? theme.primary : 'transparent',
                color: filter === f.key ? 'white' : theme.textSecondary,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {completedCount > 0 && (
          <div className="relative">
            {showClearConfirm ? (
              <div
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs"
                style={{ background: 'rgba(255,100,100,0.15)', color: '#FF6B6B' }}
              >
                <span>Clear done?</span>
                <button
                  onClick={() => { onClearCompleted(); setShowClearConfirm(false); }}
                  className="px-2 py-0.5 rounded bg-red-500/30 hover:bg-red-500/50 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-xs px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                style={{ color: theme.textSecondary }}
              >
                Clear done ({completedCount})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
