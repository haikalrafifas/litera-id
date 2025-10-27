'use client';

import useIsMobileView from '@/hooks/useIsMobileView';
import { useRouter } from 'next/navigation';

export default function AppSidebarMenu({ menus }: any) {
  const isMobileView = useIsMobileView();
  const router: any = useRouter();
  const activePath = router.pathname;

  return (
    <div className="mt-8">
      <ul>
        {menus.map((menu: any, index: any) => (
          <li
            key={index}
            className={`py-2 px-4 hover:bg-gray-700 ${activePath === menu.redirectTo ? 'bg-gray-700' : ''}`}
            onClick={() => { router.push(menu.redirectTo) }}
          >
            <span className="material-icons">{menu.icon}</span>
            {!isMobileView && menu.title}
          </li>
        ))}

        {/* <li
          className={`py-2 px-4 hover:bg-gray-700 ${activePath === '/app' ? 'bg-gray-700' : ''}`}
          onClick={() => { router.push('/app') }}
        >
          <span className="material-icons">analytics</span>
          {!isMobileView && 'Dashboard'}
        </li>
        <li
          className={`py-2 px-4 hover:bg-gray-700 ${activePath === '/app/borrow' ? 'bg-gray-700' : ''}`}
        >
          <span className="material-icons">person</span>
          {!isMobileView && <a href="/app/profile">Peminjaman Barang</a>}
        </li>

        <li
          className={`py-2 px-4 hover:bg-gray-700 ${activePath === '/app/inventory' ? 'bg-gray-700' : ''}`}
        >
          <span className="material-icons">inventory</span>
          {!isMobileView && <a href="/app/inventory">Inventaris</a>}
        </li>
        <li
          className={`py-2 px-4 hover:bg-gray-700 ${activePath === '/app/modules' ? 'bg-gray-700' : ''}`}
        >
          <span className="material-icons">menu_book</span>
          {!isMobileView && <a href="/app/modules">Modul</a>}
        </li> */}
      </ul>
    </div>
  );
}
