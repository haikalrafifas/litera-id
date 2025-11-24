'use client';

import React from 'react';
import { useLoanStore } from '@/stores/loan';
import { useUserStore } from '@/stores/user';
import { useToast } from '@/hooks/use-toast';
import { normalizeUploadPath } from '@/utilities/client/path';

export default function BookCard({ book, compact = false }: any) {
  const { add } = useLoanStore();
  const { role } = useUserStore();
  const { toast } = useToast();

  const handleAdd = () => {
    if ((book.stock ?? 0) <= 0) return;
    // Only members can add to cart
    if (role !== 'member') {
      // allow viewing for admin
      return;
    }
    add({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      category: book.category,
      image: book.image,
      qty: 1,
      stock: book.stock,
    });
    
    toast({
      title: "Added to Cart",
      description: `${book.title} has been added to your loan cart.`,
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden flex transition-shadow ${compact ? 'flex-row' : 'flex-col'}`}>
      <div className={`${compact ? 'w-24 sm:w-32' : 'w-full'} ${compact ? 'h-32 sm:h-40' : 'h-48'} flex-shrink-0 bg-gray-100`}>
        <img 
          src={normalizeUploadPath(book.image) ?? '/images/placeholder.png'} 
          alt={book.title} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">{book.title}</h3>
          {book.author && <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-1">{book.author}</p>}
          {(book.publisher || book.published_at) && (
            <p className="text-xs text-gray-400 mt-1 sm:mt-2 line-clamp-1">
              {book.publisher}{book.publisher && book.published_at && ' • '}{book.published_at?.split?.('T')?.[0]}
            </p>
          )}
          <p className="mt-2 text-xs sm:text-sm text-gray-600">ISBN: {book.isbn}</p>
        </div>

        <div className="flex items-center justify-between mt-3 sm:mt-4 gap-2">
          <div className="text-xs sm:text-sm text-gray-700">
            {(book.stock ?? 0) > 0 ? (
              <span className="text-green-600 font-medium">Tersedia {book.stock}</span>
            ) : (
              <span className="text-red-500 font-medium">Stok Habis</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={(book.stock ?? 0) <= 0 || role !== 'member'}
            className="inline-flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition text-xs sm:text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="hidden sm:inline">Pinjam</span>
          </button>
        </div>
      </div>
    </div>
  );
}