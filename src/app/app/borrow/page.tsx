'use client';

import React, { useState } from 'react';
import { BorrowProvider, useBorrowCart } from '@/contexts/BorrowContext';
import Link from 'next/link';

function BorrowCartInner() {
  const { items, remove, updateQty, clear } = useBorrowCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function checkout() {
    if (items.length === 0) return;
    setLoading(true);
    setMessage(null);

    try {
      const payload = { items: items.map((it) => ({ book_id: it.id, quantity: it.quantity })) };
      const res = await fetch('/api/v1/borrowings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Gagal membuat permintaan pinjam');
      clear();
      setMessage('Permintaan peminjaman berhasil dibuat (status: requested).');
    } catch (err: any) {
      setMessage(err?.message ?? 'Gagal saat checkout');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-green-600">Peminjaman Buku</h2>
        <Link href="/app/books" className="text-sm text-gray-600">Kembali ke Katalog</Link>
      </div>

      <div className="mt-6 space-y-4">
        {items.length === 0 && <div className="text-gray-500">Keranjang kosong. Kunjungi katalog untuk menambahkan buku.</div>}
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-4 bg-white rounded-lg p-3 shadow-sm">
            <img src={it.cover ?? '/images/book-placeholder.png'} alt={it.title} className="w-16 h-20 object-cover rounded" />
            <div className="flex-1">
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-gray-500">{it.author}</div>
              <div className="text-xs text-gray-400 mt-1">Stok: {it.stock ?? '—'}</div>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={it.stock ?? 99} value={it.quantity} onChange={(e) => updateQty(it.id, Number(e.target.value))} className="w-16 border rounded px-2 py-1" />
              <button onClick={() => remove(it.id)} className="text-red-600">Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {message && <div className="mt-4 text-sm text-gray-700 bg-emerald-50 p-3 rounded">{message}</div>}

      <div className="mt-6 flex gap-3">
        <button onClick={checkout} disabled={loading || items.length === 0} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
          {loading ? 'Mengirim...' : 'Checkout & Request Pinjam'}
        </button>
        <button onClick={() => clear()} disabled={loading} className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded">Kosongkan</button>
      </div>
    </>
  );
}

export default function BorrowCartPage() {
  return (
    <BorrowProvider>
      <BorrowCartInner />
    </BorrowProvider>
  );
}
