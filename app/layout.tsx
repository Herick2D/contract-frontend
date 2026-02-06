import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Sidebar } from '@/components/layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gerador de Contratos',
  description: 'Sistema de geração de contratos automatizada',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 dark:bg-slate-900">

        <script
          dangerouslySetInnerHTML={{
            __html: `;(function(){try{var theme=localStorage.getItem('theme')|| (document.cookie.match(/(^|; )theme=([^;]+)/)||[])[2];if(!theme){theme=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';}if(theme==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){} })();`,
          }}
        />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-72 min-h-screen">
            {children}
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#fff',
              border: 'none',
            },
          }}
        />
      </body>
    </html>
  );
}
