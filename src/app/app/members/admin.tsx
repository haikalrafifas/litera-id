'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/user';
import Cookies from 'js-cookie';
import Select from '@/components/atoms/app/Select';
import Badge from '@/components/atoms/app/Badge';
import PageHeader from '@/components/molecules/app/PageHeader';
import SearchBar from '@/components/molecules/app/SearchBar';
import Card from '@/components/molecules/app/Card';
import DataTable, { Column } from '@/components/organisms/app/DataTable';

type Member = {
  id: string;
  name: string;
  username?: string;
  email: string;
  image: string | null;
  verified_at: string | null;
  created_at: string;
};

export default function AdminManagesMembers() {
  const { token } = useUserStore();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchMembers();
  }, [page, searchQuery, statusFilter]);

  async function fetchMembers() {
    setLoading(true);
    try {
      // Real API call
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter === 'active') params.append('verified', 'true');
      if (statusFilter === 'inactive') params.append('verified', 'false');
      
      const res = await fetch(`/api/v1/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token || Cookies.get('token')}` }
      });
      
      const body = await res.json();
      if (res.ok && body.success) {
        setMembers(body.data || []);
        setTotalPages(body.pagination?.totalPages || 1);
      } else {
        console.error(body.message || 'Failed to fetch members');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(member: Member) {
    const isActivating = !member.verified_at;
    const action = isActivating ? 'aktifkan' : 'nonaktifkan';
    
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} anggota "${member.name}"?`)) return;
    
    try {
      const username = member.username || member.id;
      const res = await fetch(`/api/v1/users/${username}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token || Cookies.get('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ verified: isActivating })
      });
      
      const body = await res.json();
      if (res.ok && body.success) {
        fetchMembers();
      } else {
        alert(body.message || `Failed to ${action}`);
      }
    } catch (err) {
      console.error(err);
      alert('Unexpected error');
    }
  }

  const columns: Column<Member>[] = [
    {
      key: 'image',
      label: 'Foto',
      render: (member) => (
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {member.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 text-sm font-medium">{member.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
      ),
    },
    {
      key: 'username',
      label: 'ID Pengguna',
      render: (member) => <span className="font-mono text-sm">{member.username}</span>,
    },
    { key: 'name', label: 'Nama' },
    // {
    //   key: 'email',
    //   label: 'Email',
    //   render: (member) => <span className="text-gray-600">{member.email}</span>,
    // },
    {
      key: 'verified_at',
      label: 'Status',
      render: (member) => (
        <Badge variant={member.verified_at ? 'success' : 'default'}>
          {member.verified_at ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      ),
    },
    {
      key: 'action',
      label: 'Aksi',
      render: (member) => (
        <button
          onClick={() => toggleStatus(member)}
          className={`font-medium text-sm hover:underline ${
            member.verified_at ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {member.verified_at ? 'Nonaktifkan' : 'Aktifkan'}
        </button>
      ),
    },
  ];

  return (
    <div className="">
      <PageHeader
        title="Manajemen Anggota"
        description="Kelola data dan status keanggotaan organisasi"
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari anggota..."
          />
        </div>
        <div className="sm:w-64">
          <Select
            label="Filter Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'Semua Status' },
              { value: 'active', label: 'Aktif' },
              { value: 'inactive', label: 'Tidak Aktif' },
            ]}
          />
        </div>
      </div>

      <Card padding="none">
        <DataTable<Member>
          columns={columns}
          data={members}
          loading={loading}
          emptyState={{
            title: 'Tidak ada anggota ditemukan',
            description: 'Belum ada data anggota yang terdaftar',
          }}
          getRowKey={(member) => Number(member.username) || Math.floor(Math.random() * 1_000)}
        />
      </Card>
    </div>
  );
}
