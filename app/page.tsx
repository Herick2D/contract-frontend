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
          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6">
            <Card variant="elevated" className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Templates</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.templates}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-700" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Modelos ativos</span>
              </div>
            </Card>
            <Card variant="elevated" className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Prints</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats.prints}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Image className="w-6 h-6 text-gray-700" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Imagens carregadas</span>
              </div>
            </Card>

            <Card variant="elevated" className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Pronto para</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    Processar
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-gray-700" />
                </div>
              </div>
              <Link href="/contracts" className="mt-4 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                <span className="text-sm font-medium">Iniciar agora</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link key={action.title} href={action.href}>
                  <Card
                    variant="elevated"
                    className="p-6 cursor-pointer group hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <action.icon className="w-7 h-7 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-gray-400 transition-colors">
                      <span className="text-sm font-medium">Acessar</span>
                      <ArrowRight className="w-4 h-4 transition-transform" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Templates */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Templates Recentes</h2>
              <Link href="/templates">
                <Button variant="ghost" size="sm">
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {recentTemplates.length === 0 ? (
              <Card variant="bordered" className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Nenhum template</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">
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
                  <Card key={template.id} variant="bordered" className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {template.name}
                        </h4>
                              <p className="text-sm text-gray-500 truncate">
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

          {/* Workflow Guide */}
          <motion.div variants={itemVariants}>
            <Card variant="elevated" className="p-6 bg-gray-50">
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Fluxo de Processamento
                  </h3>
                  <p className="text-gray-500 mt-2">
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
