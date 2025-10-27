'use client';

import { useState, useEffect } from 'react';
import useIsMobileView from '@/hooks/useIsMobileView';
import AppSidebarMenu from '@/components/app/SidebarMenu';
import { getToken, decodeToken } from '@/utilities/client/jwt';

export default function AppSidebar({ sidebarOpen = true }) {
  const userRole = decodeToken(getToken()).role;
  const isMobileView = useIsMobileView();
  const [sidebarMenus, setSidebarMenus] = useState([]);

  useEffect(() => {
    // Initialize the menus array based on the user role
    let newMenus: any = [];

    if (userRole === 'MEMBER') {
      newMenus = [
        { redirectTo: '/app/member', icon: 'analytics', title: 'Dasbor' },
        { redirectTo: '/app/member/borrow', icon: 'add_shopping_cart', title: 'Peminjaman Barang' },
        { redirectTo: '/app/member/borrow/history', icon: 'history', title: 'Riwayat Pinjam' },
      ];
    }

    if (userRole === 'ADMIN') {
      newMenus = [
        { redirectTo: '/app/admin', icon: 'analytics', title: 'Dasbor' },
        { redirectTo: '/app/admin/borrow', icon: 'add_shopping_cart', title: 'Peminjaman Barang' },
        { redirectTo: '/app/admin/inventory', icon: 'inventory', title: 'Inventaris' },
        { redirectTo: '/app/admin/modules', icon: 'menu_book', title: 'Modul' },
        { redirectTo: '/app/admin/activities', icon: 'calendar_month', title: 'Kegiatan' },
      ];
    }

    // Check if the newMenus are different from the current sidebarMenus
    setSidebarMenus((prevMenus: any) => {
      if (JSON.stringify(prevMenus) !== JSON.stringify(newMenus)) {
        return newMenus;
      }
      return prevMenus;
    });
  }, [userRole]);

  return (
    <div
        className={`bg-gray-800 text-white w-64 md:w-64 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'block' : 'w-16 md:w-64 hidden'
        }`}
      >
        <div className="flex items-center justify-start p-4">
          <a href="/app" className="flex items-center text-xl font-bold text-white">
            <img src="/images/app-icon.png" width="48" alt="App Logo" className="mr-2" />
            {!isMobileView && 'Litera.id'}
          </a>
        </div>
        
        <AppSidebarMenu menus={sidebarMenus} />
      </div>
  );
}
