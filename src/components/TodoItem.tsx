import { useState } from 'react';
import type { Todo } from '../types';
import type { Theme } from '../types';
import { Trash2, Edit2 } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  theme: Theme;
  index: number;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit, theme, index }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isRemoving, setIsRemoving] = useState(false);

  const priorityColors: Record<string, string> = {
    high: '#FF6B6B',
    medium: '#FECA57',
    low: '#48DBFB',
  };

  const handleDelete = () => {
    setIsRemoving(true);
    setTimeout(() => onDelete(todo.id), 400);
  };

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEdit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div
      className={`todo-item ${isRemoving ? 'removing' : ''} priority-${todo.priority} relative rounded-2xl p-4 group cursor-default`}
      style={{
        background: todo.completed ? 'rgba(255,255,255,0.02)' : theme.cardBg,
        border: `1px solid ${todo.completed ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)'}`,
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div className="flex items-center gap-3">
        {/* Custom Checkbox */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="custom-checkbox"
          style={{
            background: todo.completed ? theme.primary : 'transparent',
            borderColor: todo.completed ? 'transparent' : 'rgba(255,255,255,0.25)',
          }}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full bg-transparent border-b-2 px-1 py-1 text-sm glass-input"
              style={{
                color: theme.textPrimary,
                borderColor: theme.primary,
              }}
            />
          ) : (
            <div>
              <p
                className={`text-sm leading-relaxed ${todo.completed ? 'line-through opacity-40' : ''}`}
                style={{ color: theme.textPrimary }}
              >
                {todo.text}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: `${priorityColors[todo.priority]}22`,
                    color: priorityColors[todo.priority],
                  }}
                >
                  {todo.priority}
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: theme.textSecondary,
                  }}
                >
                  {todo.category}
                </span>
                <span style={{ color: theme.textSecondary, fontSize: '10px', opacity: 0.5 }}>
                  • {timeAgo(todo.createdAt)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                setEditText(todo.text);
                setIsEditing(true);
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              style={{ color: theme.textSecondary }}
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={handleDelete}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors"
              style={{ color: '#FF6B6B' }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
