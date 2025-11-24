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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Loader2, UserCheck, UserX } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import type User from '@/domains/user/model';

interface PaginationData {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminManagesMembers() {
  const { token } = useUserStore();
  const { toast } = useToast();
  const [members, setMembers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'activate' | 'deactivate' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchMembers();
  }, [pagination.currentPage, debouncedSearch, statusFilter]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ 
        page: pagination.currentPage.toString(), 
        limit: pagination.limit.toString() 
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter === 'active') params.append('verified', 'true');
      if (statusFilter === 'inactive') params.append('verified', 'false');
      
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/users?${params.toString()}`, { headers });
      const result = await response.json();
      
      if (result.success) {
        setMembers(result.data || []);
        setPagination({
          ...result.pagination,
          page: result.pagination.currentPage,
          limit: result.pagination.total / result.pagination.totalPages,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || 'Failed to load members',
        });
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load members. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openActionDialog = (member: User, action: 'activate' | 'deactivate') => {
    setSelectedMember(member);
    setActionType(action);
    setIsActionDialogOpen(true);
  };

  const handleToggleStatus = async () => {
    if (!selectedMember || !actionType) return;

    setIsProcessing(true);
    try {
      const username = selectedMember.username || selectedMember.uuid;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/users/${username}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ verified: actionType === 'activate' })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsActionDialogOpen(false);
        fetchMembers();
        toast({
          title: "Success",
          description: `Member ${actionType === 'activate' ? 'activated' : 'deactivated'} successfully!`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || `Failed to ${actionType} member`,
        });
      }
    } catch (error) {
      console.error('Failed to update member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
        <p className="text-gray-600 mt-1">Kelola data pengguna dan status keanggotaan</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => {
              setStatusFilter(value);
              setPagination({ ...pagination, currentPage: 1 });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter berdasarkan status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
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
                  <TableHead>Gambar</TableHead>
                  <TableHead>ID Pengguna</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                    </TableCell>
                  </TableRow>
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Tidak ada pengguna ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.uuid}>
                      <TableCell>
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {member.image ? (
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-500 text-sm font-medium">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{member.username}</span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{member.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.verified_at ? 'success' : 'default'}>
                          {member.verified_at ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {member.verified_at ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openActionDialog(member, 'deactivate')}
                          >
                            <UserX className="h-4 w-4 text-red-600 mr-1" />
                            Nonaktifkan
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openActionDialog(member, 'activate')}
                          >
                            <UserCheck className="h-4 w-4 text-green-600 mr-1" />
                            Aktifkan
                          </Button>
                        )}
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
                Halaman {pagination.currentPage} dari {pagination.totalPages} ({pagination.total} total)
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

      {/* Action Confirmation Dialog */}
      <AlertDialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'activate' ? 'Aktifkan Pengguna' : 'Nonaktifkan Pengguna'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin {actionType === 'activate' ? 'mengaktifkan' : 'menonaktifkan'} <strong>{selectedMember?.name}</strong>?
              {actionType === 'deactivate' && ' Ini akan mencegah mereka mengakses sistem.'}
              {actionType === 'activate' && ' Ini akan memberikan mereka akses ke sistem.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleStatus} 
              disabled={isProcessing}
              className={actionType === 'deactivate' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {actionType === 'activate' ? 'Aktifkan' : 'Nonaktifkan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
