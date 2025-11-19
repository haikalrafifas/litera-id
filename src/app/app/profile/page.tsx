'use client';

import { useState } from 'react';
import { useUserStore } from '@/stores/user';
import PageHeader from '@/components/molecules/app/PageHeader';
import Card from '@/components/molecules/app/Card';
import Input from '@/components/atoms/app/Input';
import FileUpload from '@/components/atoms/app/FileUpload';
import { normalizeUploadPath } from '@/utilities/client/path';
import Cookies from 'js-cookie';

export default function ProfilePage() {
  const { name: currentName, username, image: currentImage, token, updateUser } = useUserStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentName || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Mock user data
  // const currentImage = null; // In real app, load from API

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Updating profile', { name, imageFile });

    const formData = new FormData();
    if (name) formData.append('name', name);
    if (imageFile) formData.append('image', imageFile);

    try {
      const response = await fetch('/api/v1/me', {
        method: 'PATCH',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updated = await response.json();

      const newToken =  updated.data.token.access;
      Cookies.set('token',newToken);

      updateUser({
        token: newToken,
        name: updated.data.user.name,
        image: updated.data.user.image,
      });
    } catch (error) {
      console.error('Failed to update profile', error);
    }

    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
    setName(currentName || '');
    setImageFile(null);
    setImagePreview(null);
  }

  const displayImage = imagePreview || currentImage;

  return (
    <>
      <PageHeader
        title="Profil Saya"
        description="Kelola informasi akun dan preferensi Anda"
      />

      <Card>
        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 ring-4 ring-gray-100">
              {displayImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={normalizeUploadPath(displayImage)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-gray-500 font-semibold">
                  {(currentName || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isEditing && (
              <div className="w-full max-w-md">
                <FileUpload
                  label=""
                  accept="image/*"
                  onChange={(file) => {
                    if (file) {
                      setImageFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  preview={imagePreview}
                  helperText="JPG, JPEG, atau PNG (Maks. 2MB)"
                />
              </div>
            )}
          </div>

          {/* User Information */}
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Pengguna
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-600 font-mono text-sm">
                {username}
              </div>
            </div>

            {isEditing ? (
              <Input
                label="Nama Pengguna"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama Anda"
                required
              />
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Pengguna
                </label>
                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-900">
                  {currentName || 'Tidak ada nama'}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Batal
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={(e) => {e.preventDefault(); setIsEditing(true);}}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
              >
                Edit Profil
              </button>
            )}
          </div>
        </form>
      </Card>
    </>
  );
}
