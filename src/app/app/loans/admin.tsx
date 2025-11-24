'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/user';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CheckCircle, XCircle, BookOpen, RotateCcw } from 'lucide-react';
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
  const { toast } = useToast();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'deny' | 'loan' | 'return' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchLoans();
  }, [pagination.currentPage, statusFilter]);

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.limit.toString(),
      });

      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/loans?${params.toString()}`, { headers });
      const result = await response.json();
      
      if (result.success) {
        setLoans(result.data);
        setPagination(result.pagination);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || 'Failed to load loans',
        });
      }
    } catch (error) {
      console.error('Failed to fetch loans:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load loans. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openActionDialog = (loan: Loan, action: typeof actionType) => {
    setSelectedLoan(loan);
    setActionType(action);
    setNotes(loan.notes || '');
    setIsActionDialogOpen(true);
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
        setIsActionDialogOpen(false);
        fetchLoans();
        toast({
          title: "Success",
          description: 'Loan status updated successfully!',
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || 'Failed to update loan',
        });
      }
    } catch (error) {
      console.error('Failed to update loan:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to update loan. Please try again.',
      });
    } finally {
      setIsSaving(false);
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

  const getActionTitle = () => {
    if (actionType === 'approve') return 'Approve Loan Request';
    if (actionType === 'deny') return 'Deny Loan Request';
    if (actionType === 'loan') return 'Mark as Loaned';
    if (actionType === 'return') return 'Mark as Returned';
    return '';
  };

  const getActionMessage = () => {
    if (actionType === 'approve') return 'This will approve the loan request. The member will be notified.';
    if (actionType === 'deny') return 'This will deny the loan request. The member will be notified.';
    if (actionType === 'loan') return 'This will mark the book as loaned and reduce the stock.';
    if (actionType === 'return') return 'This will mark the book as returned and restore the stock.';
    return '';
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Peminjaman</h1>
        <p className="text-gray-600 mt-1">Kelola permintaan peminjaman dan peminjaman aktif</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setPagination({ ...pagination, currentPage: 1 });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Peminjaman</SelectItem>
                <SelectItem value="requested">Diminta</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="loaned">Dipinjam</SelectItem>
                <SelectItem value="returned">Dikembalikan</SelectItem>
                <SelectItem value="overdue">Terlambat</SelectItem>
                <SelectItem value="denied">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buku</TableHead>
                  <TableHead>Anggota</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pengajuan Pada</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                    </TableCell>
                  </TableRow>
                ) : loans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Tidak ada data peminjaman.
                    </TableCell>
                  </TableRow>
                ) : (
                  loans.map((loan) => (
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
                        <div>
                          <div className="font-medium text-gray-900">{loan.user?.name}</div>
                          <div className="text-sm text-gray-500">{loan.user?.username}</div>
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
                      <TableCell>{formatDate(loan.due_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {loan.status === 'requested' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openActionDialog(loan, 'approve')}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                                Setujui
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openActionDialog(loan, 'deny')}
                              >
                                <XCircle className="h-4 w-4 text-red-600 mr-1" />
                                Tolak
                              </Button>
                            </>
                          )}
                          {loan.status === 'approved' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openActionDialog(loan, 'loan')}
                            >
                              <BookOpen className="h-4 w-4 text-blue-600 mr-1" />
                              Berikan Buku
                            </Button>
                          )}
                          {(loan.status === 'loaned' || loan.status === 'overdue') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openActionDialog(loan, 'return')}
                            >
                              <RotateCcw className="h-4 w-4 text-purple-600 mr-1" />
                              Dikembalikan
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLoan(loan);
                              setIsDetailDialogOpen(true);
                            }}
                          >
                            Detail
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.total} total)
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

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loan Details</DialogTitle>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Book</Label>
                  <p className="font-medium">{selectedLoan.book?.title}</p>
                  <p className="text-sm text-gray-500">{selectedLoan.book?.author}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Member</Label>
                  <p className="font-medium">{selectedLoan.user?.name}</p>
                  <p className="text-sm text-gray-500">{selectedLoan.user?.username}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Quantity</Label>
                  <p className="font-medium">{selectedLoan.qty}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <Badge variant={statusVariants[selectedLoan.status]}>
                    {statusLabels[selectedLoan.status]}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-500">Requested Date</Label>
                  <p className="font-medium">{formatDate(selectedLoan.requested_at)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Due Date</Label>
                  <p className="font-medium">{formatDate(selectedLoan.due_at)}</p>
                </div>
                {selectedLoan.returned_at && (
                  <div>
                    <Label className="text-gray-500">Return Date</Label>
                    <p className="font-medium">{formatDate(selectedLoan.returned_at)}</p>
                  </div>
                )}
              </div>
              {selectedLoan.notes && (
                <div>
                  <Label className="text-gray-500">Notes</Label>
                  <p className="mt-1">{selectedLoan.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionTitle()}</DialogTitle>
            <DialogDescription>{getActionMessage()}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedLoan && (
              <Card>
                <CardContent className="pt-6 space-y-2">
                  <p className="font-medium">{selectedLoan.book?.title}</p>
                  <p className="text-sm text-gray-500">Member: {selectedLoan.user?.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {selectedLoan.qty}</p>
                </CardContent>
              </Card>
            )}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add notes about this action..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAction} 
              disabled={isSaving}
              variant={actionType === 'deny' ? 'destructive' : 'default'}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
