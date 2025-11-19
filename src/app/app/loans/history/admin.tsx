'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/user';
import Table from '@/components/atoms/app/Table';
import Badge from '@/components/atoms/app/Badge';
import Pagination from '@/components/atoms/app/Pagination';
import Select from '@/components/atoms/app/Select';
import Input from '@/components/atoms/app/Input';

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
  user?: {
    uuid: string;
    name: string;
    email: string;
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
  requested: 'Requested',
  approved: 'Approved',
  loaned: 'Loaned',
  returned: 'Returned',
  cancelled: 'Cancelled',
  denied: 'Denied',
  overdue: 'Overdue',
};

export default function AdminLoanHistory() {
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
  const [searchTerm, setSearchTerm] = useState('');

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
      if (searchTerm) params.append('search', searchTerm);

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

  const getDaysOverdue = (dueDate: string | null, returnDate: string | null) => {
    if (!dueDate) return 0;
    const due = new Date(dueDate);
    const returned = returnDate ? new Date(returnDate) : new Date();
    const diff = Math.floor((returned.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const columns = [
    {
      key: 'book',
      label: 'Book',
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
      key: 'user',
      label: 'Member',
      render: (loan: Loan) => (
        <div>
          <div className="font-medium text-gray-900">{loan.user?.name}</div>
          <div className="text-sm text-gray-500">{loan.user?.email}</div>
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
          {loan.status === 'overdue' && (
            <div className="text-xs text-red-600 mt-1">
              {getDaysOverdue(loan.due_date, loan.return_date)} days overdue
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'loan_date',
      label: 'Loan Date',
      render: (loan: Loan) => formatDate(loan.loan_date),
    },
    {
      key: 'due_date',
      label: 'Due Date',
      render: (loan: Loan) => formatDate(loan.due_date),
    },
    {
      key: 'return_date',
      label: 'Return Date',
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
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Loan History</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View all loan records and history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Loans</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Returned</div>
          <div className="text-2xl font-bold text-green-600">{stats.returned}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Overdue</div>
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by book title, member name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPagination({ ...pagination, page: 1 });
                  fetchLoans();
                }
              }}
            />
          </div>
          <Select
            options={[
              { value: '', label: 'All Status' },
              { value: 'requested', label: 'Requested' },
              { value: 'approved', label: 'Approved' },
              { value: 'loaned', label: 'Loaned' },
              { value: 'returned', label: 'Returned' },
              { value: 'overdue', label: 'Overdue' },
              { value: 'denied', label: 'Denied' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={loans}
          isLoading={isLoading}
          emptyMessage="No loan history found"
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
  );
}
