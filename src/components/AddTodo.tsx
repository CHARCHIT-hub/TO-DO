import { useState, useRef, useEffect } from 'react';
import type { Todo } from '../types';
import type { Theme } from '../types';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { categories } from '../constants';

interface AddTodoProps {
  onAdd: (todo: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => void;
  theme: Theme;
}

export default function AddTodo({ onAdd, theme }: AddTodoProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('Personal');
  const [showOptions, setShowOptions] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const priorityOptions: { value: 'low' | 'medium' | 'high'; label: string; emoji: string }[] = [
    { value: 'low', label: 'Low', emoji: '🟢' },
    { value: 'medium', label: 'Medium', emoji: '🟡' },
    { value: 'high', label: 'High', emoji: '🔴' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
      return;
    }
    onAdd({ text: text.trim(), priority, category });
    setText('');
    setPriority('medium');
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (showOptions) {
      inputRef.current?.blur();
    }
  }, [showOptions]);

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center gap-2 rounded-2xl p-1.5 transition-all ${shakeInput ? 'animate-shake' : ''}`}
          style={{
            background: theme.cardBg,
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setShowOptions(false)}
            placeholder="What needs to be done?"
            className="flex-1 bg-transparent px-3 py-2.5 text-sm glass-input placeholder:opacity-30"
            style={{ color: theme.textPrimary }}
          />
          <button
            type="submit"
            className="btn-primary w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
          >
            <Plus size={18} color="white" />
          </button>
        </div>
      </form>

      {/* Options Panel */}
      {showOptions && (
        <div
          className="rounded-2xl p-4 animate-slide-down"
          style={{
            background: theme.cardBg,
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="space-y-4">
            {/* Priority */}
            <div>
              <label style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>
                Priority
              </label>
              <div className="flex gap-2">
                {priorityOptions.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                      priority === p.value ? 'shadow-lg' : ''
                    }`}
                    style={{
                      background: priority === p.value ? `${p.value === 'high' ? '#FF6B6B' : p.value === 'medium' ? '#FECA57' : '#48DBFB'}33` : 'rgba(255,255,255,0.05)',
                      color: priority === p.value ? (p.value === 'high' ? '#FF6B6B' : p.value === 'medium' ? '#FECA57' : '#48DBFB') : theme.textSecondary,
                      border: `1px solid ${priority === p.value ? (p.value === 'high' ? '#FF6B6B' : p.value === 'medium' ? '#FECA57' : '#48DBFB') : 'transparent'}`,
                    }}
                  >
                    {p.emoji} {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.filter(c => c.name !== 'All').map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className="category-pill px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: category === cat.name ? `${cat.color}22` : 'rgba(255,255,255,0.05)',
                      color: category === cat.name ? cat.color : theme.textSecondary,
                      border: `1px solid ${category === cat.name ? cat.color + '44' : 'transparent'}`,
                    }}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Options */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/5"
        style={{ color: theme.textSecondary }}
      >
        {showOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showOptions ? 'Hide' : 'Show'} options
      </button>
    </div>
  );
}
