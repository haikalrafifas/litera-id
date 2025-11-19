'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/user';
import { useLoanCart } from '@/contexts/LoanContext';
import LoadingButton from '@/components/atoms/app/LoadingButton';
// import Input from '@/components/atoms/app/Input';
import Textarea from '@/components/atoms/app/Textarea';
import Badge from '@/components/atoms/app/Badge';
import EmptyState from '@/components/atoms/app/EmptyState';
import Table from '@/components/atoms/app/Table';
import Pagination from '@/components/atoms/app/Pagination';

interface Loan {
  uuid: string;
  qty: number;
  loan_date: string | null;
  due_date: string | null;
  return_date: string | null;
  notes?: string;
  status: 'requested' | 'approved' | 'cancelled' | 'denied' | 'loaned' | 'returned' | 'overdue';
  book?: {
    isbn: string;
    title: string;
    author?: string;
    image?: string;
  };
}

interface PaginationData {
  page: number;
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
  requested: 'Menunggu',
  approved: 'Disetujui',
  loaned: 'Dipinjam',
  returned: 'Dikembalikan',
  cancelled: 'Dibatalkan',
  denied: 'Ditolak',
  overdue: 'Terlambat',
};

export default function MemberManagesLoans() {
  const { token } = useUserStore();
  const { items, clear, remove, updateQty } = useLoanCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generalNotes, setGeneralNotes] = useState('');

  useEffect(() => {
    fetchActiveLoans();
  }, [pagination.page]);

  const fetchActiveLoans = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      // Submit each book as a separate loan request
      const promises = items.map(async (item) => {
        const formData = new FormData();
        formData.append('book_isbn', item.isbn || '');
        formData.append('qty', item.quantity.toString());
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
        alert('Permintaan peminjaman berhasil dikirim!');
        clear();
        setGeneralNotes('');
        fetchActiveLoans();
      } else {
        alert('Beberapa permintaan peminjaman gagal. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Failed to submit loan requests:', error);
      alert('Gagal mengirim permintaan peminjaman');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const loanColumns = [
    {
      key: 'book',
      label: 'Buku',
      render: (loan: Loan) => (
        <div className="flex items-center gap-3">
          <img
            src={loan.book?.image || '/images/book-placeholder.png'}
            alt={loan.book?.title}
            className="w-10 h-14 object-cover rounded"
          />
          <div>
            <div className="font-medium text-gray-900">{loan.book?.title}</div>
            <div className="text-sm text-gray-500">{loan.book?.author}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'qty',
      label: 'Jml',
      render: (loan: Loan) => <span className="font-medium">{loan.qty}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (loan: Loan) => (
        <Badge variant={statusVariants[loan.status]}>
          {statusLabels[loan.status]}
        </Badge>
      ),
    },
    {
      key: 'loan_date',
      label: 'Dipinjam',
      render: (loan: Loan) => formatDate(loan.loan_date),
    },
    {
      key: 'due_date',
      label: 'Jatuh Tempo',
      render: (loan: Loan) => formatDate(loan.due_date),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Peminjaman Saya</h1>
        <p className="text-gray-600 mt-1">Kelola permintaan peminjaman buku Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Keranjang Peminjaman</h2>
            
            {items.length === 0 ? (
              <EmptyState
                title="Keranjang Anda kosong"
                description="Jelajahi buku dan tambahkan ke keranjang untuk meminta peminjaman"
                action={{
                  label: 'Jelajahi Buku',
                  onClick: () => window.location.href = '/app/books',
                }}
                icon={
                  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                }
              />
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.cover || '/images/book-placeholder.png'}
                      alt={item.title}
                      className="w-full sm:w-16 h-32 sm:h-20 object-cover rounded"
                    />
                    <div className="flex-1 w-full">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.author}</p>
                      <p className="text-xs text-gray-400 mt-1">Stok: {item.stock}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                          disabled={item.quantity >= (item.stock || 0)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <Textarea
                    label="Catatan (opsional)"
                    value={generalNotes}
                    onChange={(e) => setGeneralNotes(e.target.value)}
                    rows={3}
                    placeholder="Tambahkan permintaan atau catatan khusus..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-4 gap-3">
                  <button
                    onClick={clear}
                    className="text-red-600 hover:text-red-800 font-medium text-center sm:text-left"
                  >
                    Kosongkan Keranjang
                  </button>
                  <LoadingButton
                    onClick={handleSubmitRequest}
                    isLoading={isSubmitting}
                    variant="success"
                    className="w-full sm:w-auto"
                  >
                    Kirim Permintaan Peminjaman
                  </LoadingButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Aksi Cepat</h2>
            <div className="space-y-3">
              <a
                href="/app/books"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Jelajahi Buku
              </a>
              <a
                href="/app/loans/history"
                className="block w-full bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Lihat Riwayat
              </a>
            </div>
          </div>

          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Ringkasan</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Buku:</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Jumlah:</span>
                  <span className="font-medium">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Loans Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Peminjaman Aktif</h2>
        <div className="bg-white rounded-lg shadow">
          <Table
            columns={loanColumns}
            data={activeLoans}
            isLoading={isLoading}
            emptyMessage="Tidak ada peminjaman aktif"
          />
          
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
          />
        </div>
      </div>
    </div>
  );
}
