'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  Image,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { Header } from '@/components/layout';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { listTemplates, listPrints, checkHealth } from '@/lib/api';
import type { Template, PrintInfo } from '@/types';

interface DashboardStats {
  templates: number;
  prints: number;
  lastProcessed: string | null;
  apiStatus: 'online' | 'offline' | 'loading';
}

const quickActions = [
  {
    title: 'Upload Template',
    description: 'Adicione um novo modelo Word',
    href: '/templates',
    icon: FileText,
  },
  {
    title: 'Upload Prints',
    description: 'Envie imagens das cláusulas',
    href: '/prints',
    icon: Image,
  },
  {
    title: 'Processar Contratos',
    description: 'Gere documentos automaticamente',
    href: '/contracts',
    icon: FileSpreadsheet,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    templates: 0,
    prints: 0,
    lastProcessed: null,
    apiStatus: 'loading',
  });
  const [recentTemplates, setRecentTemplates] = useState<Template[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [templates, prints, health] = await Promise.all([
          listTemplates(),
          listPrints(),
          checkHealth(),
        ]);

        setStats({
          templates: templates.length,
          prints: prints.total,
          lastProcessed: null,
          apiStatus: health.status === 'healthy' ? 'online' : 'offline',
        });

        setRecentTemplates(templates.slice(0, 3));
      } catch (error) {
        setStats(prev => ({ ...prev, apiStatus: 'offline' }));
      }
    }

    loadData();
  }, []);

  return (
    <>
      <Header
        title="Dashboard"
        description="Visão geral do sistema de geração de contratos"
      />

      <div className="p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >

          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6">
            <Card variant="elevated" className="p-6 bg-neutral-50 dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-neutral-700 dark:text-gray-200 font-bold uppercase tracking-wide">Templates</p>
                  <p className="text-4xl font-bold text-neutral-900 dark:text-white mt-2">
                    {stats.templates}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-warm-500 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-neutral-900" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-neutral-600 dark:text-gray-300" />
                <span className="text-xs text-neutral-700 dark:text-gray-200 font-semibold uppercase tracking-wide">Modelos ativos</span>
              </div>
            </Card>
            <Card variant="elevated" className="p-6 bg-neutral-50 dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-neutral-700 dark:text-gray-200 font-bold uppercase tracking-wide">Prints</p>
                  <p className="text-4xl font-bold text-neutral-900 dark:text-white mt-2">
                    {stats.prints}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-warm-500 flex items-center justify-center">
                  <Image className="w-7 h-7 text-neutral-900" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-neutral-600 dark:text-gray-300" />
                <span className="text-xs text-neutral-700 dark:text-gray-200 font-semibold uppercase tracking-wide">Imagens carregadas</span>
              </div>
            </Card>

            <Card variant="elevated" className="p-6 bg-neutral-50 dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-neutral-700 dark:text-gray-200 font-bold uppercase tracking-wide">Pronto para</p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">
                    Processar
                  </p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-warm-500 flex items-center justify-center">
                  <FileSpreadsheet className="w-7 h-7 text-neutral-900" />
                </div>
              </div>
              <Link href="/contracts" className="mt-4 flex items-center gap-2 text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-gray-300 transition-colors font-bold uppercase text-xs tracking-wide">
                <span>Iniciar agora</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>
          </motion.div>


          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">Ações Rápidas</h2>
            <div className="grid grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link key={action.title} href={action.href}>
                  <Card
                    variant="default"
                    className="p-6 cursor-pointer group hover:border-neutral-500 transition-all duration-300 bg-neutral-50 dark:bg-gray-800"
                  >
                    <div className="w-16 h-16 rounded-lg bg-warm-500 flex items-center justify-center mb-4 group-hover:bg-warm-600 transition-all duration-300">
                      <action.icon className="w-8 h-8 text-neutral-900" />
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white transition-colors uppercase tracking-wide">
                      {action.title}
                    </h3>
                    <p className="text-sm text-neutral-700 dark:text-gray-200 mt-2">{action.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-neutral-700 dark:text-gray-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                      <span className="text-xs font-bold uppercase tracking-wide">Acessar</span>
                      <ArrowRight className="w-4 h-4 transition-transform" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>


          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white uppercase tracking-wide">Templates Recentes</h2>
              <Link href="/templates">
                <Button variant="ghost" size="sm">
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {recentTemplates.length === 0 ? (
              <Card variant="bordered" className="p-8 text-center bg-neutral-50 dark:bg-gray-800">
                <div className="w-16 h-16 rounded-lg bg-warm-500 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-neutral-900" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wide">Nenhum template</h3>
                <p className="text-sm text-neutral-700 dark:text-gray-200 mt-2 mb-4">
                  Comece fazendo upload de um modelo Word
                </p>
                <Link href="/templates">
                  <Button variant="secondary">
                    Adicionar Template
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {recentTemplates.map((template) => (
                  <Card key={template.id} variant="default" className="p-5 bg-neutral-50 dark:bg-gray-800">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-warm-500 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-neutral-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-neutral-900 dark:text-white truncate uppercase tracking-wide text-sm">
                          {template.name}
                        </h4>
                              <p className="text-xs text-neutral-700 dark:text-gray-200 truncate mt-1">
                          {template.filename}
                        </p>
                        <div className="mt-2">
                          <Badge variant={template.status === 'active' ? 'success' : 'default'}>
                            {template.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>


          <motion.div variants={itemVariants}>
            <Card variant="default" className="p-6 bg-neutral-200 dark:bg-gray-800 border-2 border-neutral-400 dark:border-gray-700">
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white uppercase tracking-wide">
                    Fluxo de Processamento
                  </h3>
                  <p className="text-neutral-700 dark:text-gray-200 mt-2 font-medium text-sm">
                    1. Upload do template Word → 2. Upload dos prints → 3. Upload do Excel → 4. Download dos contratos
                  </p>
                </div>
                <Link href="/contracts">
                  <Button variant="secondary" size="lg">
                    Começar Agora
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
