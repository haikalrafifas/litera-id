'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Image from 'next/image';
import { useUserStore } from '@/stores/user';

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { token } = useUserStore();

  // Toggle menu on mobile
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // Scrolling down
        setIsScrollingDown(true);
      } else {
        // Scrolling up
        setIsScrollingDown(false);
      }
      setLastScrollY(window.scrollY);
    };

    // Add event listener for scroll
    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`fixed w-full top-0 left-0 transition-transform duration-300 ease-in-out ${
        isScrollingDown ? '-translate-y-full' : 'translate-y-0'
      } bg-green-600 text-white py-1 z-50 bg-opac`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center sm:pl-2 pr-4">
        {/* Logos - side by side */}
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16">
            {/* <div className="absolute inset-0 bg-black/60 rounded-md"></div>
            <img
              src="/images/app-icon.png"
              alt="App Logo"
              className="w-16 h-16 relative z-10 rounded-md"
            /> */}
            {/* <span className="text-xl font-bold md:block hidden">Litera.id</span> */}
          </div>
        </div>

        {/* Navigation and Login/Signup */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-6">
            <a href="/#/" className="hover:text-gray-200">Beranda</a>
            <a href="/#/about" className="hover:text-gray-200">Tentang Kami</a>
            <a href="/#/features" className="hover:text-gray-200">Fitur</a>
            <a href="/#/collections" className="hover:text-gray-200">Koleksi</a>
          </nav>
          <div className="flex space-x-4">
            {/* <Button href="/auth/register" text="Daftar" /> */}
            {token
            ? (
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => window.location.href = '/app'}
              >
                <Image
                  src="/images/app-icon-circle.jpg"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                  width="48"
                  height="48"
                />
              </div>
            )
            : <Button href="/auth/login" text="Masuk" />}
          </div>
        </div>

        {/* Hamburger Icon for mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation (Hamburger Menu) */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-green-600 text-white py-4 px-6`}>
        <nav className="space-y-4">
          <a href="/#/" className="block">Beranda</a>
          <a href="/#/about" className="block">Tentang Kami</a>
          <a href="/#/features" className="block">Fitur</a>
          <a href="/#/collections" className="block">Koleksi</a>
        </nav>
        <div className="mt-6 flex justify-end">
          {/* <Button href="/auth/register" text="Daftar" /> */}
          {token
            ? (
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => window.location.href = '/app'}
              >
                <Image
                  src="/images/app-icon-circle.jpg"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                  width="48"
                  height="48"
                />
              </div>
            )
            : <Button href="/auth/login" text="Masuk" />}
        </div>
      </div>
    </header>
  );
}
