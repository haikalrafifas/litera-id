'use client';

import AdminManagesBooks from './admin';
import MemberBrowseBooks from './member';
import { useUserStore } from '@/stores/user';
import { notFound } from 'next/navigation';

export default function BooksPage() {
  const { role } = useUserStore();

  if (role === 'admin') return <AdminManagesBooks />;
  if (role === 'member') return <MemberBrowseBooks />;

  return notFound();
}
