'use client';

import { usePathname } from 'next/navigation';

import HomeTemplate from '@/components/templates/HomeTemplate';
import AuthTemplate from '@/components/templates/AuthTemplate';
import AppTemplate from '@/components/templates/AppTemplate';

export default function Template({ children }: any): any {
  const pathname = usePathname();
  const isAuthLayout = pathname.startsWith('/auth');
  const isAppLayout = pathname.startsWith('/app');

  if (isAppLayout) {
    return <AppTemplate>{children}</AppTemplate>;
  }
  
  if (isAuthLayout) {
    return <AuthTemplate>{children}</AuthTemplate>;
  }

  return <HomeTemplate>{children}</HomeTemplate>;
};
