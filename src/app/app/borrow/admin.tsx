'use client';

import React, { useEffect, useState } from 'react';

type Borrow = {
  id: string;
  user: any;
  items: any[];
  status: string;
  requested_at?: string;
  due_date?: string;
};

export default function AdminBorrowPage() {
  const [list, setList] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/borrowings');
      const data = await res.json();
      setList(Array.isArray(data) ? data : data.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function perform(id: string, action: 'approve' | 'mark_borrowed' | 'mark_returned' | 'deny' | 'mark_due' | 'cancel') {
    try {
      const res = await fetch(`/api/v1/borrowings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Gagal');
      }
      await load();
    } catch (e) {
      console.error(e);
      alert((e as any).message || 'Gagal melakukan aksi');
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-green-600">Manajemen Peminjaman (Admin)</h2>

      <div className="mt-4 space-y-4">
        {loading ? <div className="animate-pulse space-y-2"><div className="h-6 bg-gray-200 rounded w-1/3" /><div className="h-10 bg-gray-100 rounded" /></div> : list.length === 0 ? <div className="text-gray-500">Tidak ada permintaan.</div> : list.map((b) => (
          <div key={b.id} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">Request #{b.id} — <span className="text-sm text-gray-500">{b.user?.name}</span></div>
                <div className="text-sm text-gray-600 mt-1">Status: <span className="font-medium">{b.status}</span></div>
                <div className="text-sm text-gray-500 mt-2">{b.items.map((it: any) => `${it.title} x${it.quantity}`).join(', ')}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {b.status === 'requested' && <button onClick={() => perform(b.id, 'approve')} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>}
                {b.status === 'requested' && <button onClick={() => perform(b.id, 'deny')} className="bg-red-500 text-white px-3 py-1 rounded">Deny</button>}
                {b.status === 'approved' && <button onClick={() => perform(b.id, 'mark_borrowed')} className="bg-yellow-500 text-white px-3 py-1 rounded">Mark Borrowed</button>}
                {b.status === 'borrowed' && <button onClick={() => perform(b.id, 'mark_returned')} className="bg-green-600 text-white px-3 py-1 rounded">Mark Returned</button>}
                {b.status === 'borrowed' && <button onClick={() => perform(b.id, 'mark_due')} className="bg-red-600 text-white px-3 py-1 rounded">Mark Due</button>}
                {(b.status === 'requested' || b.status === 'approved') && <button onClick={() => perform(b.id, 'cancel')} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}