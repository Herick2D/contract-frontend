"use client";

import { Search, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  title: string;
  description?: string;
}


function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';

    const cookieTheme = document.cookie.match(/(^|; )theme=([^;]+)/);
    if (cookieTheme) return cookieTheme[2] === 'dark';

    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (e) {
    return false;
  }
}

export function Header({ title, description }: HeaderProps) {
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch(e) {}
      try { document.cookie = 'theme=dark; path=/; max-age=31536000'; } catch(e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch(e) {}
      try { document.cookie = 'theme=light; path=/; max-age=31536000'; } catch(e) {}
    }
  };

  return (
    <header className="h-20 border-b border-gray-200 bg-white dark:bg-slate-800 dark:border-slate-700 sticky top-0 z-40">
      <div className="h-full px-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-64 h-10 pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
            />
          </div>


          {mounted && (
            <button
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
