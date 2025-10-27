'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Send register request to your server API
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to login page after successful registration
        router.push('/auth/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-green-600">Buat Akun</h2>
        {error && <p className="text-green-600 text-sm text-center mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">ID Pengguna</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-600"
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-600"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Kata Sandi</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-600"
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 pt-5"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4 4-1.8 4-4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.49 12c1.11-2.91 3.85-5 7.51-5s6.4 2.09 7.51 5M2.49 12c1.11 2.91 3.85 5 7.51 5s6.4-2.09 7.51-5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4 4-1.8 4-4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.49 12c1.11-2.91 3.85-5 7.51-5s6.4 2.09 7.51 5m0 0c-1.11 2.91-3.85 5-7.51 5s-6.4-2.09-7.51-5" />
                </svg>
              )}
            </button>
          </div>

          <div className="mb-4 relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">Konfirmasi Kata Sandi</label>
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-600"
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 pt-5"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4 4-1.8 4-4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.49 12c1.11-2.91 3.85-5 7.51-5s6.4 2.09 7.51 5M2.49 12c1.11 2.91 3.85 5 7.51 5s6.4-2.09 7.51-5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4 4-1.8 4-4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.49 12c1.11-2.91 3.85-5 7.51-5s6.4 2.09 7.51 5m0 0c-1.11 2.91-3.85 5-7.51 5s-6.4-2.09-7.51-5" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Daftar
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
