'use client';

import AdminManagesLoans from './admin';
import MemberManagesLoans from './member';
import { useUserStore } from '@/stores/user';
import { notFound } from 'next/navigation';

export default function LoansPage() {
  const { role } = useUserStore();

  if (role === 'admin') return <AdminManagesLoans />;
  if (role === 'member') return <MemberManagesLoans />;

  return notFound();
}
