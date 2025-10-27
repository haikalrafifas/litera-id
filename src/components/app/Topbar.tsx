'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { removeToken } from '@/utilities/client/jwt';
import useIsMobileView from '@/hooks/useIsMobileView';

export default function AppTopbar({ userData, sidebarOpen, setSidebarOpen }: any) {
  const isMobileView = useIsMobileView();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    removeToken();

    // Add your logout logic here
    router.push('/');
  };

  useEffect(() => {
    setSidebarOpen(!isMobileView);
  }, [isMobileView]);

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button
          className="text-gray-500 focus:outline-none md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
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
        <span className="text-sm text-gray-800">{userData.name}</span>
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
        <div className="absolute top-16 right-6 bg-white shadow-md rounded-md w-48 py-2">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-gray-800">Profil</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-gray-800">Pengaturan</li>
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
