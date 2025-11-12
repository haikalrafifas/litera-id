'use client';

import React from 'react';
import { useBorrowCart } from '@/contexts/BorrowContext';
import { useUserStore } from '@/stores/user';

export default function BookCard({ book, compact = false }: any) {
  const { add } = useBorrowCart();
  const { role } = useUserStore();

  const handleAdd = () => {
    if ((book.stock ?? 0) <= 0) return;
    // Only members can add to cart
    if (role !== 'member') {
      // allow viewing for admin
      return;
    }
    add({
      id: String(book.id ?? book.isbn),
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      cover: book.cover,
      quantity: 1,
      stock: book.stock,
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden flex flex-col ${compact ? 'md:flex-row' : ''}`}>
      <div className="w-full md:w-36 h-48 md:h-auto flex-shrink-0 bg-gray-100">
        <img src={book.cover ?? '/images/book-placeholder.png'} alt={book.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{book.author}</p>
          <p className="text-sm text-gray-400 mt-2">{book.publisher} • {book.published_at?.split?.('T')?.[0]}</p>
          <p className="mt-3 text-sm text-gray-600">ISBN: {book.isbn}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">{(book.stock ?? 0) > 0 ? <span className="text-green-600 font-medium">Tersedia {book.stock}</span> : <span className="text-red-500 font-medium">Habis</span>}</div>
          <button
            onClick={handleAdd}
            disabled={(book.stock ?? 0) <= 0 || role !== 'member'}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Pinjam
          </button>
        </div>
      </div>
    </div>
  );
}