'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CardCarousel from '@/components/molecules/CardCarousel';
// import collectionsData from '@/database/mocks/books';
import { fadeInUp } from './animations';

export default function LatestCollectionsSection() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchLatestBooks() {
      try {
        const response = await fetch('/api/v1/books?limit=10');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Error fetching latest books');
        }

        setBooks(result.data);
      } catch (error) {
        console.error('Failed to fetch latest books:', error);
      }
    }

    fetchLatestBooks();
  }, []);

  return (
    <section id="/collections" className="bg-gray-100 py-16 text-center">
      <motion.div className="max-w-7xl mx-auto px-4" {...fadeInUp}>
        <h2 className="text-3xl font-semibold text-green-600 mb-4">Koleksi Terbaru</h2>
        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Belum Ada Data</h3>
          </motion.div>
        ) : (
          <CardCarousel contents={books} />
        )}
        <div className="mt-8">
          <a href="/books" className="text-green-600 hover:underline">Lihat lebih banyak</a>
        </div>
      </motion.div>
    </section>
  );
}
