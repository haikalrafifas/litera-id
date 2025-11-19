'use client';

import { useState, useEffect } from 'react';
import useIsMobileView from '@/hooks/useIsMobileView';
import AppSidebarMenu from '@/components/layouts/app/SidebarMenu';
import { useUserStore } from '@/stores/user';

export interface SidebarMenu {
  redirectTo: string; // target path
  icon: string; // display icon
  title: string; // display text
}

export default function AppSidebar({ sidebarOpen = true, setSidebarOpen }: any) {
  const { role } = useUserStore();
  const isMobileView = useIsMobileView();
  const [sidebarMenus, setSidebarMenus] = useState<SidebarMenu[]>([]);

  useEffect(() => {
    // Initialize the menus array based on the user role
    let newMenus: SidebarMenu[] = [];

    if (role === 'member') {
      newMenus = [
        { redirectTo: '/app', icon: 'analytics', title: 'Analitik' },
        { redirectTo: '/app/books', icon: 'menu_book', title: 'Katalog' },
        { redirectTo: '/app/loans', icon: 'add_shopping_cart', title: 'Peminjaman Buku' },
        { redirectTo: '/app/loans/history', icon: 'history', title: 'Riwayat Pinjam' },
      ];
    }

    if (role === 'admin') {
      newMenus = [
        { redirectTo: '/app', icon: 'analytics', title: 'Analitik' },
        { redirectTo: '/app/books', icon: 'menu_book', title: 'Katalog' },
        { redirectTo: '/app/loans', icon: 'add_shopping_cart', title: 'Peminjaman Buku' },
        // { redirectTo: '/app/activities', icon: 'calendar_month', title: 'Kegiatan' },
        { redirectTo: '/app/members', icon: 'person', title: 'Anggota' },
      ];
    }

    // Check if the newMenus are different from the current sidebarMenus
    setSidebarMenus((prevMenus) => {
      if (JSON.stringify(prevMenus) !== JSON.stringify(newMenus)) {
        return newMenus;
      }
      return prevMenus;
    });
  }, [role]);

  // Compute classes for desktop vs mobile behavior:
  // - Desktop (md and up): sidebar is part of layout and toggles between full (w-64) and collapsed (w-16)
  // - Mobile (sm): sidebar overlays the content; when closed it is translated off-canvas
  const desktopWidthClass = sidebarOpen ? 'w-64' : 'w-16';
  const mobileTransformClass = sidebarOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    <>
      {/* Mobile overlay: when sidebar is open on mobile, show a backdrop that closes the sidebar when clicked */}
      {isMobileView && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        onClick={() => isMobileView && setSidebarOpen(false)}
        className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out z-40
          ${isMobileView ? `fixed top-0 left-0 bottom-0 w-64 ${mobileTransformClass}` : desktopWidthClass}
        `}
        style={{ minHeight: '100vh' }}
      >
        <div className="flex items-center justify-start p-4 border-b border-gray-700">
          <a href="/app" className="flex items-center text-xl font-bold text-white">
            <img src="/images/app-icon.png" width="48" alt="App Logo" className="mr-2" />
            {sidebarOpen && 'Litera.id'}
          </a>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AppSidebarMenu menus={sidebarMenus} collapsed={!sidebarOpen && !isMobileView} />
        </div>
      </aside>
    </>
  );
}
