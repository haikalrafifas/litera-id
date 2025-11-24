'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/user';
import { useLoanStore } from '@/stores/loan';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Minus, Plus, Loader2, BookOpen, History } from 'lucide-react';
import type Loan from '@/domains/loan/model';
import { normalizeUploadPath } from '@/utilities/client/path';

interface PaginationData {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusVariants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  requested: 'info',
  approved: 'warning',
  loaned: 'success',
  returned: 'default',
  cancelled: 'default',
  denied: 'error',
  overdue: 'error',
};

const statusLabels: Record<string, string> = {
  requested: 'Pending',
  approved: 'Approved',
  loaned: 'Borrowed',
  returned: 'Returned',
  cancelled: 'Cancelled',
  denied: 'Denied',
  overdue: 'Overdue',
};

export default function MemberManagesLoans() {
  const { token } = useUserStore();
  const { items, clear, remove, updateQty } = useLoanStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generalNotes, setGeneralNotes] = useState('');

  useEffect(() => {
    fetchActiveLoans();
  }, [pagination.currentPage]);

  const fetchActiveLoans = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.limit.toString(),
        status: 'requested,approved,loaned',
      });

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/loans?${params.toString()}`, { headers });
      const result = await response.json();
      
      if (result.success) {
        setActiveLoans(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch loans:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load loans.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const promises = items.map(async (item) => {
        const formData = new FormData();
        formData.append('isbn', item.isbn);
        formData.append('qty', item.qty.toString());
        if (generalNotes) formData.append('notes', generalNotes);

        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/v1/loans', {
          method: 'POST',
          headers,
          body: formData,
        });

        return response.json();
      });

      const results = await Promise.all(promises);
      const allSuccess = results.every(r => r.success);

      if (allSuccess) {
        toast({
          title: "Sukses",
          description: 'Permintaan pinjaman berhasil dikirim!',
        });
        clear();
        setGeneralNotes('');
        fetchActiveLoans();
      } else {
        toast({
          variant: "destructive",
          title: "Galat",
          description: 'Beberapa permintaan pinjaman gagal. Silakan coba lagi.',
        });
      }
    } catch (error) {
      console.error('Failed to submit loan requests:', error);
      toast({
        variant: "destructive",
        title: "Galat",
        description: 'Gagal mengirim permintaan pinjaman.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: Date | string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pinjaman Saya</h1>
        <p className="text-gray-600 mt-1">Kelola permintaan pinjaman buku Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Keranjang Pinjaman</CardTitle>
              <CardDescription>Buku yang ingin Anda pinjam</CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Keranjang Anda kosong</h3>
                  <p className="text-gray-600 mb-4">Jelajahi buku dan tambahkan ke keranjang Anda untuk mengajukan pinjaman</p>
                  <Button asChild>
                    <a href="/app/books">Jelajahi Buku</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.isbn} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={normalizeUploadPath(item.image) || '/images/book-placeholder.png'}
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.author}</p>
                        <p className="text-xs text-gray-400 mt-1">Stok: {item.stock}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQty(item.isbn, item.qty - 1)}
                          disabled={item.qty <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.qty}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQty(item.isbn, item.qty + 1)}
                          disabled={item.qty >= item.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(item.isbn)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Catatan (opsional)</Label>
                      <Textarea
                        id="notes"
                        value={generalNotes}
                        onChange={(e) => setGeneralNotes(e.target.value)}
                        rows={3}
                        placeholder="Tambahkan permintaan khusus atau catatan..."
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-4 gap-3 border-t">
                      <Button
                        variant="outline"
                        onClick={clear}
                      >
                        Bersihkan Keranjang
                      </Button>
                      <Button
                        onClick={handleSubmitRequest}
                        disabled={isSubmitting}
                        variant="success"
                      >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Kirim Permintaan Pinjaman
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tindakan Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="primary">
                <a href="/app/books">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Jelajahi Buku
                </a>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <a href="/app/loans/history">
                  <History className="mr-2 h-4 w-4" />
                  Lihat Riwayat
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Cart Summary */}
          {items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Buku:</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah:</span>
                  <span className="font-medium">{items.reduce((sum, item) => sum + item.qty, 0)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Active Loans Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pinjaman Aktif</CardTitle>
          <CardDescription>Permintaan pinjaman Anda yang sedang berjalan dan tertunda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buku</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Permintaan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                    </TableCell>
                  </TableRow>
                ) : activeLoans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      Tidak ada pinjaman aktif
                    </TableCell>
                  </TableRow>
                ) : (
                  activeLoans.map((loan) => (
                    <TableRow key={loan.uuid}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={normalizeUploadPath(loan.book?.image) || '/images/book-placeholder.png'}
                            alt={loan.book?.title}
                            className="w-10 h-14 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{loan.book?.title}</div>
                            <div className="text-sm text-gray-500">{loan.book?.author}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{loan.qty}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[loan.status]}>
                          {statusLabels[loan.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(loan.requested_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-700">
                Halaman {pagination.currentPage} dari {pagination.totalPages}
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
        </CardContent>
      </Card>
    </div>
  );
}
