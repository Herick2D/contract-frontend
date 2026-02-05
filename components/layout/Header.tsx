'use client';

import { Bell, Search, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="h-20 border-b border-primary-100 bg-white/80 backdrop-blur-lg sticky top-0 z-40">
      <div className="h-full px-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">{title}</h1>
          {description && (
            <p className="text-sm text-primary-500 mt-0.5">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-64 h-10 pl-10 pr-4 bg-primary-50 border border-primary-100 rounded-xl text-sm placeholder:text-primary-400 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary-50 transition-colors">
            <Bell className="w-5 h-5 text-primary-500" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent-500 rounded-full" />
          </button>

          {/* Profile */}
          <button className="flex items-center gap-3 h-10 pl-2 pr-4 rounded-xl hover:bg-primary-50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-primary-700">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
