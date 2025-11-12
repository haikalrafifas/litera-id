'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/user';
import Topbar from '@/components/layouts/Topbar';
import Footer from "@/components/layouts/Footer";

export default function HomeTemplate({ children }: any) {
  const loadFromCookie = useUserStore((state) => state.loadFromCookie);
    useEffect(() => {
      loadFromCookie();
    }, [loadFromCookie]);

  return (
    <div className="flex-1 flex flex-col w-full">
      <Topbar />
        {children}
      <Footer />
    </div>
  );
}
