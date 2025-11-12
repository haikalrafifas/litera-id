'use client';

import AdminDashboard from './admin';
import MemberDashboard from './member';
import { useUserStore } from '@/stores/user';

export default function DashboardPage() {
  const { role } = useUserStore();

  if (role === 'admin') return <AdminDashboard />;
  if (role === 'member') return <MemberDashboard />;

  return <DashboardSkeleton />;
}

function DashboardSkeleton() {
  const listItems = Array.from({ length: 5 });
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-4">
        {/* Header */}
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="h-8 bg-gray-400 rounded w-1/3 md:w-1/4" />
          <div className="flex gap-4 w-full md:w-auto">
            <div className="h-8 bg-gray-300 rounded w-24" />
            <div className="h-8 bg-gray-300 rounded w-24" />
            <div className="h-8 bg-gray-300 rounded w-24 hidden md:block" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded border border-gray-200">
              <div className="h-6 bg-gray-400 rounded w-2/3 mb-3" />
              <div className="h-10 bg-gray-300 rounded w-full" />
            </div>
          ))}
        </div>

        {/* Main area: large content + list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2 space-y-4">
            <div className="h-48 bg-gray-300 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-28 bg-gray-300 rounded" />
              <div className="h-28 bg-gray-300 rounded" />
              <div className="h-28 bg-gray-300 rounded" />
              <div className="h-28 bg-gray-300 rounded" />
            </div>
          </div>

          <div className="space-y-4">
            {listItems.map((_, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-3 bg-gray-50 rounded border border-gray-200"
              >
                <div className="h-12 w-12 rounded-full bg-gray-400 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className={`h-4 rounded bg-gray-${idx % 2 === 0 ? '400' : '300'} w-${idx % 3 === 0 ? '5/6' : '3/4'}`} />
                  <div className="h-3 rounded bg-gray-300 w-full" />
                  <div className="h-3 rounded bg-gray-300 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer / actions */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="h-11 bg-gray-300 rounded w-full md:w-1/3" />
          <div className="h-11 bg-gray-300 rounded w-full md:w-1/3" />
        </div>
      </div>
    </div>
  );
}
