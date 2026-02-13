'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FileText, Image, FileSpreadsheet, Home, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Prints', href: '/prints', icon: Image },
  { name: 'Processar', href: '/contracts', icon: FileSpreadsheet },
];

const secondaryNavigation = [
  { name: 'Configurações', href: '/settings', icon: Settings },
  { name: 'Ajuda', href: '/help', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-neutral-100 dark:bg-slate-800 border-r-2 border-neutral-300 dark:border-slate-700 flex flex-col">
      <div className="h-20 flex items-center px-6 border-b-2 border-neutral-300 dark:border-slate-700 bg-neutral-200 dark:bg-slate-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warm-500 dark:bg-slate-700 flex items-center justify-center">
            <FileText className="w-5 h-5 text-neutral-900 dark:text-slate-200" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-white">Gerador</h1>
            <p className="text-xs text-neutral-700 dark:text-slate-300 -mt-0.5">de Contratos</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-3">
          Menu
        </p>

        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-neutral-900 bg-warm-500 dark:text-white dark:bg-slate-700 font-bold'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon
                className={cn(
                  'w-5 h-5 relative z-10',
                  isActive && 'text-neutral-900 dark:text-white'
                )}
              />
              <span className="relative z-10">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-neutral-900 dark:bg-blue-400 rounded-none"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-2 border-neutral-300 dark:border-slate-700 bg-neutral-200 dark:bg-slate-900">
        <div className="p-3 rounded-lg bg-neutral-300 dark:bg-slate-700 border border-neutral-400 dark:border-slate-600">
          <p className="text-xs text-neutral-700 dark:text-slate-300 font-semibold">API Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-neutral-900 dark:text-white font-bold uppercase tracking-wide">
              Online
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
