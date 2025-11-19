'use client';

import AdminManagesMembers from './admin';
import { useUserStore } from '@/stores/user';
import { notFound } from 'next/navigation';

export default function MembersPage() {
  const { role } = useUserStore();

  if (role === 'admin') return <AdminManagesMembers />;

  return notFound();
}
