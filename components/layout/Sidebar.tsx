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
    <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Gerador</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">de Contratos</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-primary-500 uppercase tracking-wider mb-3">
          Menu
        </p>
        
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-gray-900 bg-gray-100 dark:text-gray-100 dark:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className={cn('w-5 h-5 relative z-10', isActive && 'text-gray-700 dark:text-gray-200')} />
              <span className="relative z-10">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gray-700 dark:bg-gray-200 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}

        <div className="pt-6 mt-6 border-t border-primary-800">
          <p className="px-3 text-xs font-semibold text-primary-500 uppercase tracking-wider mb-3">
            Sistema
          </p>
          
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-white bg-primary-800'
                    : 'text-primary-400 hover:text-white hover:bg-primary-800'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">API Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
