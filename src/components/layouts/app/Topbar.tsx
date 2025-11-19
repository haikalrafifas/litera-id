'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import useIsMobileView from '@/hooks/useIsMobileView';
import Cookies from 'js-cookie';
import { useUserStore } from '@/stores/user';
import { normalizeUploadPath } from '@/utilities/client/path';
import { FaBars } from 'react-icons/fa';

export default function AppTopbar({ sidebarOpen, setSidebarOpen }: any) {
  const isMobileView = useIsMobileView();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { name, image, clearUser } = useUserStore();

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
          <FaBars />
        </button>

        {/* <div className="text-lg font-semibold text-gray-800">Dashboard</div> */}
      </div>

      {/* User Avatar and Name */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="text-sm text-gray-800">{name}</span>
        {image ? (
          <img src={normalizeUploadPath(image)} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <span className="text-4xl text-gray-500 font-semibold">
            {(name || 'U').charAt(0).toUpperCase()}
          </span>
        )}
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
