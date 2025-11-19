'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/user';
import Table from '@/components/atoms/app/Table';
import Badge from '@/components/atoms/app/Badge';
import Pagination from '@/components/atoms/app/Pagination';
import Select from '@/components/atoms/app/Select';

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
  requested: 'Pending',
  approved: 'Approved',
  loaned: 'Borrowed',
  returned: 'Returned',
  cancelled: 'Cancelled',
  denied: 'Denied',
  overdue: 'Overdue',
};

export default function MemberLoanHistory() {
  const { token } = useUserStore();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchLoans();
  }, [pagination.page, statusFilter]);

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (statusFilter) params.append('status', statusFilter);

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/loans?${params.toString()}`, { headers });
      const result = await response.json();
      
      if (result.success) {
        setLoans(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    } finally {
      setIsLoading(false);
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

  const getDaysRemaining = (dueDate: string | null) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const columns = [
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
      label: 'Qty',
      render: (loan: Loan) => <span className="font-medium">{loan.qty}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (loan: Loan) => (
        <div>
          <Badge variant={statusVariants[loan.status]}>
            {statusLabels[loan.status]}
          </Badge>
          {loan.status === 'loaned' && loan.due_date && (
            <div className="text-xs text-gray-600 mt-1">
              {(() => {
                const days = getDaysRemaining(loan.due_date);
                if (days === null) return null;
                if (days < 0) return <span className="text-red-600">{Math.abs(days)} days overdue</span>;
                if (days === 0) return <span className="text-orange-600">Due today</span>;
                if (days <= 3) return <span className="text-orange-600">{days} days left</span>;
                return <span>{days} days left</span>;
              })()}
            </div>
          )}
        </div>
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
    {
      key: 'return_date',
      label: 'Dikembalikan',
      render: (loan: Loan) => formatDate(loan.return_date),
    },
  ];

  const stats = {
    total: pagination.total,
    active: loans.filter(l => ['requested', 'approved', 'loaned'].includes(l.status)).length,
    returned: loans.filter(l => l.status === 'returned').length,
    overdue: loans.filter(l => l.status === 'overdue').length,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Peminjaman</h1>
        <p className="text-gray-600 mt-1">Lihat riwayat peminjaman dan pinjaman Anda saat ini</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Aktif</div>
          <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Dikembalikan</div>
          <div className="text-2xl font-bold text-green-600">{stats.returned}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Terlambat</div>
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <Select
          label="Filter by Status"
          options={[
            { value: '', label: 'Semua' },
            { value: 'requested', label: 'Pending' },
            { value: 'approved', label: 'Disetujui' },
            { value: 'loaned', label: 'Sedang Dipinjam' },
            { value: 'returned', label: 'Dikembalikan' },
            { value: 'overdue', label: 'Terlambat' },
            { value: 'denied', label: 'Ditolak' },
            { value: 'cancelled', label: 'Dibatalkan' },
          ]}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPagination({ ...pagination, page: 1 });
          }}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={loans}
          isLoading={isLoading}
          emptyMessage="Tidak ada riwayat peminjaman. Mulailah meminjam buku untuk melihat riwayat Anda di sini."
        />
        
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setPagination({ ...pagination, page })}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-4">
        <a
          href="/app/books"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Jelajahi Buku
        </a>
        <a
          href="/app/loans"
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Keranjang Saya
        </a>
      </div>
    </div>
  );
}
