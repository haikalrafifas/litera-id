'use client';

import React, { useEffect, useState } from 'react';
import BookCard from '@/components/atoms/app/BookCard';
import { BorrowProvider, useBorrowCart } from '@/contexts/BorrowContext';
import Link from 'next/link';

function BooksListInner() {
  const [books, setBooks] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { totalItems } = useBorrowCart();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/books');
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : data.data ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = Array.from(new Set(books.map((b) => b.category).filter(Boolean)));

  const filtered = books.filter((b) => {
    if (category && b.category !== category) return false;
    if (!q) return true;
    const term = q.toLowerCase();
    return [b.title, b.author, b.isbn, b.publisher, b.category].join(' ').toLowerCase().includes(term);
  });

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-2/3">
          <div className="relative">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari buku, penulis, ISBN..." className="w-full border rounded-lg py-3 px-4 shadow-sm" />
            <div className="absolute right-3 top-3 text-gray-400">
              <span className="material-icons text-lg">search</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/app/borrow" className="inline-flex items-center gap-2 bg-white border border-green-200 text-green-600 px-4 py-2 rounded-lg shadow-sm">
            Keranjang ({totalItems})
          </Link>
        </div>
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        <button onClick={() => setCategory(null)} className={`px-3 py-1 rounded-full ${category === null ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Semua</button>
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1 rounded-full ${category === c ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>{c}</button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 bg-gray-100 rounded-lg animate-pulse" />) : filtered.length === 0 ? <div className="col-span-full text-center text-gray-500 py-8">Tidak ada hasil</div> : filtered.map((b) => <BookCard key={b.id ?? b.isbn} book={b} />)}
      </div>
    </>
  );
}

export default function BooksPageWrapper() {
  return (
    <BorrowProvider>
      <BooksListInner />
    </BorrowProvider>
  );
}
