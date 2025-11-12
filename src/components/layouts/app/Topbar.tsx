'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import useIsMobileView from '@/hooks/useIsMobileView';
import Cookies from 'js-cookie';
import { useUserStore } from '@/stores/user';

export default function AppTopbar({ sidebarOpen, setSidebarOpen }: any) {
  const isMobileView = useIsMobileView();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { name, clearUser } = useUserStore();

  const handleLogout = () => {
    Cookies.remove('token');
    clearUser();
    router.push('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobileView);    
  }, [isMobileView]);

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button
          className="text-gray-500 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* <div className="text-lg font-semibold text-gray-800">Dashboard</div> */}
      </div>

      {/* User Avatar and Name */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="text-sm text-gray-800">{name}</span>
        <img
          // src={userData.image}
          src="/images/app-icon.png"
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover"
          width="48"
        />
      </div>

      {/* User Menu Overlay */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-16 right-6 bg-white shadow-md rounded-md w-48 py-2 z-50"
          onClick={() => setMenuOpen(false)}
        >
          <ul>
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-gray-800"
              onClick={() => router.push('/app/profile')}
            >
              Profil
            </li>
            {/* <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-gray-800">Pengaturan</li> */}
            <li
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-gray-800"
              onClick={handleLogout}
            >
              Keluar
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
