'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/user';
import { useLoanStore } from '@/stores/loan';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import type Book from '@/domains/book/model';
import { normalizeUploadPath } from '@/utilities/client/path';

interface PaginationData {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function MemberBrowseBooks() {
  const { token } = useUserStore();
  const { items, add, totalItems, hasItem, getItem } = useLoanStore();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchBooks();
  }, [pagination.currentPage, debouncedSearch, categoryFilter]);
  
  useEffect(() => {
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
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);

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
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load books. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (book: Book) => {
    if (book.stock === 0) {
      toast({
        variant: "destructive",
        title: "Out of Stock",
        description: 'This book is currently out of stock.',
      });
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
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jelajahi Buku</h1>
          <p className="text-gray-600 mt-1">Temukan dan pinjam buku dari koleksi kami</p>
        </div>
        {totalItems > 0 && (
          <Button asChild variant="success">
            <a href="/app/loans">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Keranjang ({totalItems})
            </a>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari berdasarkan judul, penulis, atau ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <CardContent className="pt-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : books.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Buku tidak ditemukan</h3>
            <p className="text-gray-600">
              {searchTerm || categoryFilter !== 'all' 
                ? "Coba sesuaikan filter pencarian Anda" 
                : "Tidak ada buku yang tersedia saat ini"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {books.map((book) => {
              const inCart = hasItem(book.isbn);
              const cartItem = getItem(book.isbn);
              
              return (
                <Card key={book.isbn} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-64 bg-gray-100">
                    <img
                      src={normalizeUploadPath(book.image) || '/images/book-placeholder.png'}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    {book.category && (
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        {book.category}
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <CardDescription className="line-clamp-1">{book.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Penerbit:</span>
                      <span className="font-medium line-clamp-1">{book.publisher}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Stok:</span>
                      <Badge variant={book.stock > 0 ? 'success' : 'error'}>
                        {book.stock} tersedia
                      </Badge>
                    </div>
                    {book.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 pt-2">
                        {book.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {inCart ? (
                      <div className="flex items-center gap-2 w-full">
                        <Badge variant="success" className="flex-1 justify-center py-2">
                          Dalam Keranjang ({cartItem?.qty})
                        </Badge>
                        <Button asChild variant="outline" size="sm">
                          <a href="/app/loans">Lihat Keranjang</a>
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleAddToCart(book)} 
                        disabled={book.stock === 0}
                        className="w-full"
                        variant={book.stock === 0 ? "outline" : "primary"}
                      >
                        {book.stock === 0 ? 'Habis' : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah ke Keranjang
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.total} total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                  disabled={pagination.currentPage === 1}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
