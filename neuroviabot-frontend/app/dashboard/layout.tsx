'use client';

import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { ToastProvider } from '@/hooks/useToast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <SessionProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-950">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          <main className="md:ml-64 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </ToastProvider>
    </SessionProvider>
  );
}
