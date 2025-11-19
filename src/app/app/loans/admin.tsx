'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/user';
import Table from '@/components/atoms/app/Table';
import Modal from '@/components/atoms/app/Modal';
import Badge from '@/components/atoms/app/Badge';
import LoadingButton from '@/components/atoms/app/LoadingButton';
import Pagination from '@/components/atoms/app/Pagination';
import Select from '@/components/atoms/app/Select';
import Textarea from '@/components/atoms/app/Textarea';

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
  requested: 'Diminta',
  approved: 'Disetujui',
  loaned: 'Dipinjam',
  returned: 'Dikembalikan',
  cancelled: 'Dibatalkan',
  denied: 'Ditolak',
  overdue: 'Terlambat',
};

export default function AdminManageLoans() {
  const { token } = useUserStore();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'deny' | 'loan' | 'return' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [notes, setNotes] = useState('');

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

  const openActionModal = (loan: Loan, action: typeof actionType) => {
    setSelectedLoan(loan);
    setActionType(action);
    setNotes(loan.notes || '');
    setIsActionModalOpen(true);
  };

  const handleAction = async () => {
    if (!selectedLoan || !actionType) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      
      let newStatus = selectedLoan.status;
      if (actionType === 'approve') newStatus = 'approved';
      else if (actionType === 'deny') newStatus = 'denied';
      else if (actionType === 'loan') newStatus = 'loaned';
      else if (actionType === 'return') newStatus = 'returned';

      formData.append('status', newStatus);
      if (notes) formData.append('notes', notes);

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/loans/${selectedLoan.uuid}`, {
        method: 'PATCH',
        headers,
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setIsActionModalOpen(false);
        fetchLoans();
      } else {
        alert(result.message || 'Failed to update loan');
      }
    } catch (error) {
      console.error('Failed to update loan:', error);
      alert('Failed to update loan');
    } finally {
      setIsSaving(false);
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
      key: 'user',
      label: 'Anggota',
      render: (loan: Loan) => (
        <div>
          <div className="font-medium text-gray-900">{loan.user?.name}</div>
          <div className="text-sm text-gray-500">{loan.user?.email}</div>
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
      label: 'Tanggal Pinjam',
      render: (loan: Loan) => formatDate(loan.loan_date),
    },
    {
      key: 'due_date',
      label: 'Jatuh Tempo',
      render: (loan: Loan) => formatDate(loan.due_date),
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (loan: Loan) => (
        <div className="flex gap-2">
          {loan.status === 'requested' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openActionModal(loan, 'approve');
                }}
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                Setujui
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openActionModal(loan, 'deny');
                }}
                className="text-red-600 hover:text-red-800 font-medium text-sm"
              >
                Tolak
              </button>
            </>
          )}
          {loan.status === 'approved' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openActionModal(loan, 'loan');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Berikan Buku
            </button>
          )}
          {(loan.status === 'loaned' || loan.status === 'overdue') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openActionModal(loan, 'return');
              }}
              className="text-purple-600 hover:text-purple-800 font-medium text-sm"
            >
              Tandai Dikembalikan
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLoan(loan);
              setIsDetailModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-800 font-medium text-sm"
          >
            Detail
          </button>
        </div>
      ),
    },
  ];

  const getActionTitle = () => {
    if (actionType === 'approve') return 'Setujui Permintaan Peminjaman';
    if (actionType === 'deny') return 'Tolak Permintaan Peminjaman';
    if (actionType === 'loan') return 'Berikan Buku ke Anggota';
    if (actionType === 'return') return 'Tandai Sebagai Dikembalikan';
    return '';
  };

  const getActionMessage = () => {
    if (actionType === 'approve') return 'Ini akan menyetujui permintaan peminjaman. Anggota akan diberitahu.';
    if (actionType === 'deny') return 'Ini akan menolak permintaan peminjaman. Anggota akan diberitahu.';
    if (actionType === 'loan') return 'Ini akan menandai buku sebagai dipinjam dan mengurangi stok.';
    if (actionType === 'return') return 'Ini akan menandai buku sebagai dikembalikan dan mengembalikan stok.';
    return '';
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Manajemen Peminjaman</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Kelola permintaan dan peminjaman aktif</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Filter berdasarkan Status"
            options={[
              { value: '', label: 'Semua Peminjaman' },
              { value: 'requested', label: 'Diminta' },
              { value: 'approved', label: 'Disetujui' },
              { value: 'loaned', label: 'Dipinjam' },
              { value: 'returned', label: 'Dikembalikan' },
              { value: 'overdue', label: 'Terlambat' },
              { value: 'denied', label: 'Ditolak' },
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
          emptyMessage="Tidak ada peminjaman ditemukan"
        />
        
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setPagination({ ...pagination, page })}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
        />
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Peminjaman"
        size="lg"
      >
        {selectedLoan && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Buku</h3>
                <p className="mt-1 text-gray-900">{selectedLoan.book?.title}</p>
                <p className="text-sm text-gray-500">{selectedLoan.book?.author}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Anggota</h3>
                <p className="mt-1 text-gray-900">{selectedLoan.user?.name}</p>
                <p className="text-sm text-gray-500">{selectedLoan.user?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Jumlah</h3>
                <p className="mt-1 text-gray-900">{selectedLoan.qty}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-1">
                  <Badge variant={statusVariants[selectedLoan.status]}>
                    {statusLabels[selectedLoan.status]}
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tanggal Pinjam</h3>
                <p className="mt-1 text-gray-900">{formatDate(selectedLoan.loan_date)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Jatuh Tempo</h3>
                <p className="mt-1 text-gray-900">{formatDate(selectedLoan.due_date)}</p>
              </div>
              {selectedLoan.return_date && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tanggal Kembali</h3>
                  <p className="mt-1 text-gray-900">{formatDate(selectedLoan.return_date)}</p>
                </div>
              )}
            </div>
            {selectedLoan.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Catatan</h3>
                <p className="mt-1 text-gray-900">{selectedLoan.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Action Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={getActionTitle()}
        footer={
          <>
            <button
              onClick={() => setIsActionModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Batal
            </button>
            <LoadingButton
              onClick={handleAction}
              isLoading={isSaving}
              variant={actionType === 'deny' ? 'danger' : 'primary'}
            >
              Konfirmasi
            </LoadingButton>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">{getActionMessage()}</p>
          {selectedLoan && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{selectedLoan.book?.title}</p>
              <p className="text-sm text-gray-500">Anggota: {selectedLoan.user?.name}</p>
              <p className="text-sm text-gray-500">Jumlah: {selectedLoan.qty}</p>
            </div>
          )}
          <Textarea
            label="Catatan (opsional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Tambahkan catatan tentang tindakan ini..."
          />
        </div>
      </Modal>
    </div>
  );
}
