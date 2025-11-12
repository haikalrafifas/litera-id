'use client';

import React, { useEffect, useState } from 'react';

type Member = { id: string; name: string; email: string; banned?: boolean };

export default function AdminManageMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/members');
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : data.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleBan(m: Member) {
    try {
      await fetch(`/api/v1/members/${m.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banned: !m.banned }),
      });
      await load();
    } catch (e) {
      console.error(e);
      alert('Gagal mengubah status anggota');
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-green-600">Manajemen Anggota</h2>
      <div className="mt-4 space-y-3">
        {loading ? <div className="animate-pulse space-y-2"><div className="h-6 bg-gray-200 rounded w-1/3" /></div> : members.map((m) => (
          <div key={m.id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm border">
            <div>
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-gray-500">{m.email}</div>
            </div>
            <div>
              <button onClick={() => toggleBan(m)} className={`px-3 py-1 rounded ${m.banned ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}`}>
                {m.banned ? 'Unban' : 'Ban'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
