'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/user';
import { LoanProvider } from '@/contexts/LoanContext';
import AppSidebar from '../layouts/app/Sidebar';
import AppTopbar from '../layouts/app/Topbar';
import AppFooter from '../layouts/app/Footer';

export default function AppTemplate({ children }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadFromCookie = useUserStore((state) => state.loadFromCookie);
  useEffect(() => {
    loadFromCookie();
  }, [loadFromCookie]);

  const { role } = useUserStore();
  if (role === null) children = <>Memuat...</>;

  return (
    <LoanProvider>
      <div className="flex min-h-screen bg-gray-100 text-black">
        <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col w-full">
          <AppTopbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <div className="flex flex-col min-h-screen bg-gray-50 p-6">
            {children}
          </div>
          <AppFooter />
        </div>
      </div>
    </LoanProvider>
  );
}
