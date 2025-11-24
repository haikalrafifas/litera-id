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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import type Book from '@/domains/book/model';
import { normalizeUploadPath } from '@/utilities/client/path';

interface PaginationData {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminManageBooks() {
  const { token } = useUserStore();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteBook, setDeleteBook] = useState<Book | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [formData, setFormData] = useState<Partial<Book>>({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    published_at: undefined,
    category: '',
    description: '',
    stock: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchBooks();
  }, [pagination.currentPage, debouncedSearch, categoryFilter]);

  useEffect(() => {
    const uniqueCategories = [...new Set(books.map(b => b.category).filter(Boolean))] as string[];
    setCategories(uniqueCategories);
  }, [books]);

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
      
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);
      
      const response = await fetch(`/api/v1/books?${params.toString()}`, { headers });
      const result = await response.json();
      
      if (result.success) {
        setBooks(result.data);
        setPagination(result.pagination);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || 'Failed to load books',
        });
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load books. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingBook(null);
    setFormData({
      isbn: '',
      title: '',
      author: '',
      publisher: '',
      published_at: undefined,
      category: '',
      description: '',
      stock: 0,
    });
    setImageFile(null);
    setErrors({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (book: Book) => {
    setEditingBook(book);
    setFormData({
      isbn: book.isbn,
      title: book.title,
      author: book.author || '',
      publisher: book.publisher || '',
      published_at: book.published_at,
      category: book.category || '',
      description: book.description || '',
      stock: book.stock,
    });
    setImageFile(null);
    setErrors({});
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (book: Book) => {
    setDeleteBook(book);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.isbn || formData.isbn.length !== 13) {
      newErrors.isbn = 'ISBN must be exactly 13 characters';
    }
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    if (formData.stock === undefined || formData.stock < 0) {
      newErrors.stock = 'Stock must be a positive number';
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
          if (key === 'published_at' && value instanceof Date) {
            formDataToSend.append(key, value.toISOString());
          } else {
            formDataToSend.append(key, value.toString());
          }
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
        setIsDialogOpen(false);
        fetchBooks();
        toast({
          title: "Success",
          description: editingBook ? 'Book updated successfully!' : 'Book added successfully!',
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || 'Failed to save book',
        });
      }
    } catch (error) {
      console.error('Failed to save book:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to save book. Please try again.',
      });
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
        setIsDeleteDialogOpen(false);
        fetchBooks();
        toast({
          title: "Success",
          description: 'Book deleted successfully!',
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || 'Failed to delete book',
        });
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to delete book. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Buku</h1>
          <p className="text-gray-600 mt-1">Kelola koleksi perpustakaan Anda</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Buku Baru
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan judul, penulis, atau ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Sampul</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Penerbit</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  </TableCell>
                </TableRow>
              ) : books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Tidak ada buku ditemukan. Tambahkan buku pertama Anda untuk memulai.
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book) => (
                  <TableRow key={book.isbn}>
                    <TableCell>
                      <img 
                        src={normalizeUploadPath(book.image) || '/images/book-placeholder.png'} 
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{book.isbn}</TableCell>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.publisher}</TableCell>
                    <TableCell>
                      {book.category && (
                        <Badge variant="secondary">{book.category}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={book.stock > 0 ? 'success' : 'error'}>
                        {book.stock} pcs
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(book)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(book)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
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
              Menampilkan halaman {pagination.currentPage} dari {pagination.totalPages} ({pagination.total} total)
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
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBook ? 'Edit Buku' : 'Tambah Buku Baru'}</DialogTitle>
            <DialogDescription>
              {editingBook ? 'Perbarui informasi buku di bawah ini.' : 'Isi detail untuk menambahkan buku baru ke perpustakaan.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN *</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="9781234567890"
                maxLength={13}
                disabled={!!editingBook}
              />
              {errors.isbn && <p className="text-sm text-red-600">{errors.isbn}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Judul *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul buku"
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Penulis</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Nama penulis"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="publisher">Penerbit</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                placeholder="Nama penerbit"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="published_at">Tanggal Terbit</Label>
              <Input
                id="published_at"
                type="date"
                value={formData.published_at ? new Date(formData.published_at).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value ? new Date(e.target.value) : undefined })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Fiction, Science, History"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stok *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                min={0}
              />
              {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Gambar Sampul Buku</Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-gray-500">JPG atau PNG, maksimal 2MB</p>
              {editingBook?.image && (
                <img 
                  src={normalizeUploadPath(editingBook.image)} 
                  alt="Current cover"
                  className="w-20 h-28 object-cover rounded mt-2"
                />
              )}
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Deskripsi buku..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingBook ? 'Perbarui Buku' : 'Tambah Buku'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Buku</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{deleteBook?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSaving} className="bg-red-600 hover:bg-red-700">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
