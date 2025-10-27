'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
// import { useAuthToken } from '@/hooks/useAuthToken';
import { getToken, decodeToken } from '@/utilities/client/jwt';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import AppTopbar from '@/components/app/Topbar';
import AppSidebar from '@/components/app/Sidebar';
import Footer from "@/components/Footer";
import AppFooter from '@/components/app/Footer';

export default function Content({ children }: any): any {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const pathname = usePathname();
  const isAuthLayout = pathname.startsWith('/auth');
  const isAppLayout = pathname.startsWith('/app');

  let userData = { name: '', image: null, role: 'MEMBER' };
  if (isAppLayout) {
    const decodedData = decodeToken(getToken());
    // If access token is not valid
    if (!decodedData) return router.push('/');
    const userRole = decodedData.role.toLowerCase();
    if (userRole !== pathname.split('/')[2]) {
      // If user role is not valid
      return router.push('/app/' + userRole);
    }
    // useAuthToken();
    userData = decodedData;
  }

  const renderConditionalComponent = (component: any) => {
    const components: any = {
      'topbar': <Topbar />,
      'topbarapp': <AppTopbar
        userData={userData}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />,
      'sidebarapp': <AppSidebar sidebarOpen={sidebarOpen} />,
      'footer': <Footer />,
      'footerapp': <AppFooter />,
    };

    return isAuthLayout
      ? '' // Auth
      : isAppLayout
        ? components[component+'app'] // App
        : components[component]; // Landing
  };

  const renderContent = () => {
    return (
      <div className="flex-1 flex flex-col w-full">
        {renderConditionalComponent('topbar')}
          {children}
        {renderConditionalComponent('footer')}
      </div>
    );
  };

  return isAppLayout ? (
      <div className="flex h-screen bg-gray-100">
        {renderConditionalComponent('sidebar')}
        {renderContent()}
      </div>
    ) : renderContent();
};
