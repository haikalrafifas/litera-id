'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/user';
import BookCard from '@/components/atoms/app/BookCard';
import Pagination from '@/components/atoms/app/Pagination';
import Input from '@/components/atoms/app/Input';
import Select from '@/components/atoms/app/Select';
import EmptyState from '@/components/atoms/app/EmptyState';
import { useLoanCart } from '@/contexts/LoanContext';
import type Book from '@/domains/book/model';

interface PaginationData {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function MemberBrowseBooks() {
  const { token } = useUserStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const { items, totalItems } = useLoanCart();

  useEffect(() => {
    fetchBooks();
  }, [pagination.currentPage, searchTerm, categoryFilter]);

  useEffect(() => {
    // Extract unique categories from books
    const uniqueCategories = [...new Set(books.map(b => b.category).filter(Boolean))] as string[];
    setCategories(uniqueCategories);
  }, [books]);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/books?${params.toString()}`, { headers });
      const result = await response.json();
      
      if (result.success) {
        setBooks(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    fetchBooks();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jelajahi Buku</h1>
            <p className="text-gray-600 mt-1">Temukan dan pinjam buku dari koleksi kami</p>
          </div>
          {totalItems > 0 && (
            <a
              href="/app/loans"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Keranjang ({totalItems})
            </a>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Cari berdasarkan judul, penulis, atau ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              options={[
                { value: '', label: 'Semua Kategori' },
                ...categories.map(cat => ({ value: cat, label: cat })),
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <EmptyState
          title="Tidak ada buku ditemukan"
          description={searchTerm || categoryFilter ? "Coba sesuaikan filter pencarian Anda" : "Tidak ada buku tersedia saat ini"}
          icon={
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.isbn} book={{ ...book, id: book.isbn, cover: book.image }} />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
            />
          </div>
        </>
      )}
    </div>
  );
}
