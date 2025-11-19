'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { normalizeUploadPath } from '@/utilities/client/path';
import Topbar from '@/components/layouts/Topbar';
import Footer from '@/components/layouts/Footer';
import type Book from '@/domains/book/model';

export default function BookPage({ params }: any) {
  const { isbn }: any = use(params);
  const [data, setData] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/books/${isbn}`)
      .then((res) => res.json())
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isbn]);

  if (loading) {
    return (
      <>
        <main className="min-h-screen pt-24 pb-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-96 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <main className="min-h-screen pt-24 pb-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Buku Tidak Ditemukan</h1>
              <p className="text-gray-600 mb-8">Maaf, buku yang Anda cari tidak tersedia.</p>
              <a
                href="/books"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Daftar Buku
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Topbar />
      <main className="min-h-screen pt-20 pb-16 bg-gray-50">
        {/* Hero Section with Image */}
        <div className="relative h-[40vh] md:h-[50vh] bg-gradient-to-r from-green-900 to-green-700 overflow-hidden">
          {data.image && (
            <div className="absolute inset-0">
              <Image 
                src={normalizeUploadPath(data.image)} 
                alt={data.title} 
                fill
                className="object-cover opacity-30"
                priority
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="relative h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-gray-200 mb-4">
                <a href="/" className="hover:text-white transition-colors">Beranda</a>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <a href="/books" className="hover:text-white transition-colors">Buku</a>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white">{data.title}</span>
              </nav>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {data.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-white/90">
                {data.published_at && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{new Date(data.published_at).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                )}
                {data.author && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{data.author}</span>
                  </div>
                )}
                {data.category && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span className="text-sm font-semibold">{data.category}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Image Section */}
            {data.image && (
              <div className="relative h-[400px] md:h-[500px] bg-gray-100">
                <Image 
                  src={normalizeUploadPath(data.image)} 
                  alt={data.title} 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}

            {/* Text Content */}
            <div className="p-8 md:p-12">
              {/* Status Badge */}
              {/* <div className="mb-6">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  data.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : data.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {data.status === 'approved' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {data.status === 'approved' ? 'Disetujui' : data.status === 'pending' ? 'Menunggu Persetujuan' : 'Ditolak'}
                </span>
              </div> */}

              {/* Book Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
                {data.published_at && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tanggal Terbit</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(data.published_at).toLocaleDateString('id-ID', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                )}
                
                {data.author && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Penulis</p>
                      <p className="text-sm font-semibold text-gray-900">{data.author}</p>
                    </div>
                  </div>
                )}
                
                {data.category && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Kategori</p>
                      <p className="text-sm font-semibold text-gray-900">{data.category}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {data.description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Deskripsi Buku</h2>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    {data.description.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Bagikan Buku</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: data.title,
                              text: data.description || '',
                              url: window.location.href
                            });
                          }
                        }}
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                        aria-label="Share"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <a
                    href="/books"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Lihat Buku Lainnya
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
