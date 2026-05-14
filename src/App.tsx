import { useState, useEffect, useCallback } from 'react';
import type { Todo } from './types';
import type { Theme } from './types';
import type { FilterType } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { themes, categories } from './constants';
import ThemeSelector from './components/ThemeSelector';
import TodoItem from './components/TodoItem';
import ProgressBar from './components/ProgressBar';
import Stats from './components/Stats';
import AddTodo from './components/AddTodo';
import { v4 as uuidv4 } from 'uuid';
import {
  Sparkles,
  Search,
  Palette,
  Star,
} from 'lucide-react';

function Confetti({ show }: { show: boolean }) {
  if (!show) return null;

  const colors = ['#FF6B6B', '#48DBFB', '#FECA57', '#48DB80', '#A29BFE', '#FF9FF3', '#FD79A8'];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            background: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 2 + 2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const sampleTodos: Todo[] = [
    { id: uuidv4(), text: 'Welcome to TaskFlow! 🎉 Try checking me off', completed: false, priority: 'high', category: 'Personal', createdAt: Date.now() - 3600000 },
    { id: uuidv4(), text: 'Explore different themes with the palette icon', completed: false, priority: 'medium', category: 'Creative', createdAt: Date.now() - 7200000 },
    { id: uuidv4(), text: 'Add a new task using the input above', completed: false, priority: 'medium', category: 'Personal', createdAt: Date.now() - 10800000 },
    { id: uuidv4(), text: 'Try categorizing your tasks', completed: true, priority: 'low', category: 'Work', createdAt: Date.now() - 86400000, completedAt: Date.now() - 3600000 },
  ];
  const [todos, setTodos] = useLocalStorage<Todo[]>('taskflow-todos', sampleTodos);
  const [theme, setTheme] = useLocalStorage<Theme>('taskflow-theme', themes[0]);
  const [filter, setFilter] = useLocalStorage<FilterType>('taskflow-filter', 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    setAppLoaded(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    const now = new Date();
    setDateString(now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
  }, []);

  const handleAddTodo = useCallback(
    (data: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => {
      const newTodo: Todo = {
        ...data,
        id: uuidv4(),
        completed: false,
        createdAt: Date.now(),
      };
      setTodos((prev) => [newTodo, ...prev]);
    },
    [setTodos]
  );

  const handleToggleTodo = useCallback(
    (id: string) => {
      const todo = todos.find(t => t.id === id);
      if (todo && !todo.completed) {
        const allOthersComplete = todos.filter(t => t.id !== id).every(t => t.completed);
        if (allOthersComplete && todos.length > 0) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3500);
        }
      }
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
            : t
        )
      );
    },
    [todos, setTodos]
  );

  const handleDeleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    },
    [setTodos]
  );

  const handleEditTodo = useCallback(
    (id: string, text: string) => {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
    },
    [setTodos]
  );

  const handleClearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, [setTodos]);

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .filter((todo) => selectedCategory === 'All' || todo.category === selectedCategory)
    .filter((todo) => todo.text.toLowerCase().includes(searchQuery.toLowerCase()));

  const completedCount = todos.filter(t => t.completed).length;

  const motivationalMessages = [
    'You\'re doing amazing! ✨',
    'Keep pushing forward! 💪',
    'Great progress today! 🌟',
    'Almost there! Keep going! 🚀',
    'Your future self will thank you! 🙌',
  ];

  const currentMessage = todos.length === 0
    ? 'Start by adding your first task above! 🎯'
    : completedCount === 0
      ? motivationalMessages[0]
      : completedCount >= todos.length * 0.75
        ? motivationalMessages[2]
        : motivationalMessages[Math.floor(completedCount / Math.max(1, todos.length)) % motivationalMessages.length];

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-all duration-700"
      style={{
        background: theme.bgGradient,
        ['--card-bg' as string]: theme.cardBg,
        ['--primary' as string]: theme.primary,
        ['--text-primary' as string]: theme.textPrimary,
        ['--text-secondary' as string]: theme.textSecondary,
      }}
    >
      {/* Background Orbs */}
      <div
        className="bg-orb animate-float-slow"
        style={{
          width: '400px',
          height: '400px',
          background: theme.primary,
          top: '-100px',
          right: '-100px',
          opacity: 0.08,
        }}
      />
      <div
        className="bg-orb animate-float"
        style={{
          width: '300px',
          height: '300px',
          background: theme.secondary,
          bottom: '-50px',
          left: '-50px',
          opacity: 0.06,
        }}
      />
      <div
        className="bg-orb animate-float-slow"
        style={{
          width: '200px',
          height: '200px',
          background: theme.accent,
          top: '40%',
          left: '60%',
          opacity: 0.05,
        }}
      />

      {/* Confetti */}
      <Confetti show={showConfetti} />

      {/* Theme Selector Modal */}
      <ThemeSelector
        theme={theme}
        onThemeChange={setTheme}
        isOpen={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />

      {/* Main Content */}
      <div
        className={`relative z-10 max-w-lg mx-auto px-4 py-8 transition-all duration-700 ${
          appLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  boxShadow: `0 8px 24px ${theme.primary}44`,
                }}
              >
                <Sparkles size={22} color="white" />
              </div>
              <div>
                <h1
                  className="text-xl font-bold tracking-tight"
                  style={{ color: theme.textPrimary }}
                >
                  TaskFlow
                </h1>
                <p
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  {greeting} 👋 · {dateString}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowThemeSelector(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center glass hover:bg-white/10 transition-all"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <Palette size={18} style={{ color: theme.textSecondary }} />
            </button>
          </div>

          {/* Progress */}
          {todos.length > 0 && (
            <div
              className="rounded-2xl p-5 mb-6 animate-slide-up"
              style={{
                background: theme.cardBg,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <ProgressBar completed={completedCount} total={todos.length} theme={theme} />
              <p
                className="text-xs mt-3 text-center"
                style={{ color: theme.textSecondary }}
              >
                {currentMessage}
              </p>
            </div>
          )}
        </header>

        {/* Add Todo */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <AddTodo onAdd={handleAddTodo} theme={theme} />
        </div>

        {/* Search & Categories */}
        <div className="space-y-4 mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          {/* Search */}
          <div
            className="flex items-center gap-2 rounded-2xl p-1.5"
            style={{ background: theme.cardBg, border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Search size={16} style={{ color: theme.textSecondary, marginLeft: '12px', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="flex-1 bg-transparent py-2 text-sm glass-input placeholder:opacity-30"
              style={{ color: theme.textPrimary }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 hover:bg-white/10 transition-colors"
                style={{ color: theme.textSecondary }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="category-pill flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5"
                style={{
                  background: selectedCategory === cat.name ? `${cat.color}22` : 'rgba(255,255,255,0.04)',
                  color: selectedCategory === cat.name ? cat.color : theme.textSecondary,
                  border: `1px solid ${selectedCategory === cat.name ? cat.color + '33' : 'rgba(255,255,255,0.04)'}`,
                }}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Stats
              todos={todos}
              theme={theme}
              onClearCompleted={handleClearCompleted}
              filter={filter}
              onFilterChange={setFilter}
            />
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-2">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo, index) => (
              <div key={todo.id} className="animate-slide-up" style={{ animationDelay: `${0.25 + index * 0.04}s` }}>
                <TodoItem
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
                  theme={theme}
                  index={index}
                />
              </div>
            ))
          ) : (
            <div
              className="rounded-2xl p-12 text-center animate-fade-in"
              style={{ background: theme.cardBg, border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="text-5xl mb-4">
                {todos.length === 0 ? '🚀' : '🔍'}
              </div>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: theme.textPrimary }}
              >
                {todos.length === 0 ? 'No tasks yet' : 'No tasks found'}
              </p>
              <p style={{ color: theme.textSecondary, fontSize: '12px' }}>
                {todos.length === 0
                  ? 'Add your first task to get started!'
                  : 'Try adjusting your filters or search'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer
          className="mt-12 pb-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star size={12} style={{ color: theme.accent }} />
            <span style={{ color: theme.textSecondary, fontSize: '11px' }}>
              Made with ❤️ by TaskFlow
            </span>
            <Star size={12} style={{ color: theme.accent }} />
          </div>
          <p style={{ color: theme.textSecondary, fontSize: '10px', opacity: 0.5 }}>
            Your tasks are saved locally ✨
          </p>
        </footer>
      </div>
    </div>
  );
}
