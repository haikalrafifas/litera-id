'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/user';
import Table from '@/components/atoms/app/Table';
import Modal from '@/components/atoms/app/Modal';
import Input from '@/components/atoms/app/Input';
import Textarea from '@/components/atoms/app/Textarea';
import LoadingButton from '@/components/atoms/app/LoadingButton';
import Pagination from '@/components/atoms/app/Pagination';
import Badge from '@/components/atoms/app/Badge';
import FileUpload from '@/components/atoms/app/FileUpload';

interface Book {
  isbn: string;
  title: string;
  author?: string;
  publisher?: string;
  published_at?: string;
  category?: string;
  description?: string;
  qty: number;
  image?: string;
}

interface PaginationData {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminManageBooks() {
  const { token } = useUserStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteBook, setDeleteBook] = useState<Book | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Partial<Book>>({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    published_at: '',
    category: '',
    description: '',
    qty: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchBooks();
  }, [pagination.currentPage, searchTerm]);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`/api/v1/books?${params.toString()}`, { headers });
      const result = await response.json();
      
      if (result.success) {
        setBooks(result.data);
        setPagination(result.pagination);
      } else {
        alert(`Gagal memuat buku: ${result.message || 'Terjadi kesalahan'}`);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
      alert('Gagal memuat daftar buku. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingBook(null);
    setFormData({
      isbn: '',
      title: '',
      author: '',
      publisher: '',
      published_at: '',
      category: '',
      description: '',
      qty: 0,
    });
    setImageFile(null);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setFormData({
      isbn: book.isbn,
      title: book.title,
      author: book.author || '',
      publisher: book.publisher || '',
      published_at: book.published_at?.split('T')[0] || '',
      category: book.category || '',
      description: book.description || '',
      qty: book.qty,
    });
    setImageFile(null);
    setErrors({});
    setIsModalOpen(true);
  };

  const openDeleteModal = (book: Book) => {
    setDeleteBook(book);
    setIsDeleteModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.isbn || formData.isbn.length !== 13) {
      newErrors.isbn = 'ISBN harus tepat 13 karakter';
    }
    if (!formData.title?.trim()) {
      newErrors.title = 'Judul wajib diisi';
    }
    if (formData.qty === undefined || formData.qty < 0) {
      newErrors.qty = 'Stok harus berupa angka positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formDataToSend.append(key, value.toString());
        }
      });

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const url = editingBook ? `/api/v1/books/${formData.isbn}` : '/api/v1/books';
      const method = editingBook ? 'PATCH' : 'POST';

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setIsModalOpen(false);
        fetchBooks();
        alert(editingBook ? 'Buku berhasil diperbarui!' : 'Buku berhasil ditambahkan!');
      } else {
        alert(result.message || 'Gagal menyimpan buku');
      }
    } catch (error) {
      console.error('Failed to save book:', error);
      alert('Gagal menyimpan buku. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteBook) return;

    setIsSaving(true);
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/v1/books/${deleteBook.isbn}`, {
        method: 'DELETE',
        headers,
      });

      const result = await response.json();

      if (result.success) {
        setIsDeleteModalOpen(false);
        fetchBooks();
        alert('Buku berhasil dihapus!');
      } else {
        alert(result.message || 'Gagal menghapus buku');
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
      alert('Gagal menghapus buku. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Sampul',
      render: (book: Book) => (
        <img 
          src={book.image || '/images/placeholder.png'} 
          alt={book.title}
          className="w-12 h-16 object-cover rounded"
        />
      ),
    },
    { key: 'isbn', label: 'ISBN' },
    { key: 'title', label: 'Judul' },
    { key: 'author', label: 'Penulis' },
    { key: 'publisher', label: 'Penerbit' },
    { key: 'category', label: 'Kategori' },
    {
      key: 'qty',
      label: 'Stok',
      render: (book: Book) => (
        <Badge variant={book.qty > 0 ? 'success' : 'error'}>
          {book.qty} unit
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (book: Book) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(book);
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Ubah
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(book);
            }}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Manajemen Buku</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Kelola koleksi buku perpustakaan</p>
        </div>
        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
        >
          + Tambah Buku Baru
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={books}
          isLoading={isLoading}
          emptyMessage="Tidak ada buku ditemukan. Tambahkan buku pertama Anda untuk memulai."
        />
        
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBook ? 'Ubah Buku' : 'Tambah Buku Baru'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Batal
            </button>
            <LoadingButton
              onClick={handleSave}
              isLoading={isSaving}
              variant="primary"
            >
              {editingBook ? 'Perbarui Buku' : 'Simpan Buku'}
            </LoadingButton>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="ISBN"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            error={errors.isbn}
            required
            maxLength={13}
            placeholder="9781234567890"
            disabled={!!editingBook}
          />
          <Input
            label="Judul"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            required
            placeholder="Judul buku"
          />
          <Input
            label="Penulis"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Nama penulis"
          />
          <Input
            label="Penerbit"
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            placeholder="Nama penerbit"
          />
          <Input
            label="Tanggal Terbit"
            type="date"
            value={formData.published_at}
            onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
          />
          <Input
            label="Kategori"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Misalnya: Fiksi, Sains, Sejarah"
          />
          <Input
            label="Stok"
            type="number"
            value={formData.qty}
            onChange={(e) => setFormData({ ...formData, qty: parseInt(e.target.value) || 0 })}
            error={errors.qty}
            required
            min={0}
          />
          <div className="md:col-span-2">
            <FileUpload
              label="Gambar Sampul Buku"
              accept="image/jpeg,image/png"
              onChange={(file) => setImageFile(file)}
              helperText="JPG atau PNG, maksimal 2MB"
              currentImage={editingBook?.image}
            />
          </div>
          <div className="md:col-span-2">
            <Textarea
              label="Deskripsi"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Deskripsi buku..."
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Buku"
        footer={
          <>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Batal
            </button>
            <LoadingButton
              onClick={handleDelete}
              isLoading={isSaving}
              variant="danger"
            >
              Hapus Buku
            </LoadingButton>
          </>
        }
      >
        <p className="text-gray-700">
          Apakah Anda yakin ingin menghapus <strong>{deleteBook?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  );
}
