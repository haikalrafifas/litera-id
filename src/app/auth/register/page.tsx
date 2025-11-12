'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  body as userSchema,
  User,
} from '@/schemas/user';

export default function Register() {
  const [formData, setFormData] = useState<User>({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<Partial<User>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setErrors({});
    setErrorMessage('');
    setIsSubmitting(true);

    const result = userSchema.safeParse(formData);

    if (!result.success) {
      const errors: any = result.error.flatten().fieldErrors;
      const firstErrors: any = {};

      for (const field in errors) {
        if (errors[field] && errors[field][0]) {
          firstErrors[field] = errors[field][0];
        }
      }

      setErrors(firstErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Send register request to your server API
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 200) {
        router.push('/auth/login');
      } else if (response.status === 400) {
        if (!data.errors) {
          setErrorMessage('Akun sudah terdaftar');
        } else {
          if (data.errors.name) {
            setErrors((prev) => ({ ...prev, name: data.errors.name }));
          }
          if (data.errors.username) {
            setErrors((prev) => ({ ...prev, username: data.errors.username }));
          }
          if (data.errors.password) {
            setErrors((prev) => ({ ...prev, password: data.errors.password }));
          }
          if (data.errors.confirmPassword) {
            setErrors((prev) => ({ ...prev, password: data.errors.confirmPassword }));
          }
        }
      } else {
        setErrorMessage('Galat server');
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-green-600">Registrasi</h2>
        {errorMessage && <p className="text-green-600 text-sm text-center mt-2">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-600"
              required
              autoFocus
            />
            {errors.name && <p className="text-red-600 text-sm text-center mt-2">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">ID Pengguna</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-600"
              required
            />
            {errors.username && <p className="text-red-600 text-sm text-center mt-2">{errors.username}</p>}
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Kata Sandi</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-600"
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 pt-5"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              <span className="material-icons mt-2">
                {passwordVisible ? 'visibility' : 'visibility_off'}
              </span>
            </button>
            {errors.password && <p className="text-red-600 text-sm text-center mt-2">{errors.password}</p>}
          </div>

          <div className="mb-4 relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">Konfirmasi Kata Sandi</label>
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-600"
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 pt-5"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              <span className="material-icons mt-2">
                {confirmPasswordVisible ? 'visibility' : 'visibility_off'}
              </span>
            </button>
            {errors.confirmPassword && <p className="text-red-600 text-sm text-center mt-2">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Tunggu...</span>
            ) : (
              'Daftar'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Sudah punya akun?</p>
          <a href="/auth/login" className="text-sm text-green-600 hover:underline">Masuk disini</a>
        </div>
      </div>
    </div>
  );
}
