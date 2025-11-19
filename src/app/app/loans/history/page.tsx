'use client';

import AdminLoanHistory from './admin';
import MemberLoanHistory from './member';
import { useUserStore } from '@/stores/user';
import { notFound } from 'next/navigation';

export default function LoanHistoryPage() {
  const { role } = useUserStore();

  if (role === 'admin') return <AdminLoanHistory />;
  if (role === 'member') return <MemberLoanHistory />;

  return notFound();
}
