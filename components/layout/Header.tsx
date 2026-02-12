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
    <header className="h-20 border-b-2 border-neutral-300 bg-neutral-100 dark:bg-slate-800 dark:border-slate-700 sticky top-0 z-40">
      <div className="h-full px-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-gray-100">{title}</h1>
          {description && (
            <p className="text-sm text-neutral-600 dark:text-gray-300 mt-0.5">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-64 h-10 pl-10 pr-4 bg-neutral-100 dark:bg-gray-800 border border-neutral-400 dark:border-gray-700 rounded-lg text-sm placeholder:text-neutral-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-warm-500 focus:ring-1 focus:ring-warm-500 transition-all text-neutral-900 dark:text-white"
            />
          </div>


          {mounted && (
            <button
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-200 dark:hover:bg-gray-700 transition-colors border border-neutral-300 dark:border-gray-700"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-neutral-600" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
