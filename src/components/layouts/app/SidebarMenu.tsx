'use client';

import { useRouter } from 'next/navigation';
import type { SidebarMenu } from './Sidebar';

interface AppSidebarMenuProps {
  menus: SidebarMenu[];
  collapsed?: boolean;
}

export default function AppSidebarMenu(
  { menus, collapsed = false }: AppSidebarMenuProps,
) {
  const router: any = useRouter();
  const activePath = router.pathname;

  return (
    <div className="mt-8">
      <ul>
        {menus.map((menu: any, index: any) => (
          <li
            key={index}
            className={`
              flex items-center gap-3
              ${collapsed ? 'justify-center py-3 px-2' : 'py-2 px-4'} hover:bg-gray-700 cursor-pointer
              ${activePath === menu.redirectTo ? 'bg-gray-700' : ''}
            `}
            onClick={() => { router.push(menu.redirectTo) }}
          >
            <span className="material-icons text-lg">{menu.icon}</span>
            {!collapsed && <span>{menu.title}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
