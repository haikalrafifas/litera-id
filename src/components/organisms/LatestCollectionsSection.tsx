'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CardCarousel from '@/components/molecules/CardCarousel';
import collectionsData from '@/database/mocks/books';
import { fadeInUp } from './animations';

export default function LatestCollectionsSection() {
  const [latestCollections] = useState(collectionsData);

  return (
    <section id="/collections" className="bg-gray-100 py-16 text-center">
      <motion.div className="max-w-7xl mx-auto px-4" {...fadeInUp}>
        <h2 className="text-3xl font-semibold text-green-600 mb-4">Koleksi Terbaru</h2>
          <CardCarousel contents={latestCollections} />
        <div className="mt-8">
          <a href="#/collections" className="text-green-600 hover:underline">Lihat lebih banyak</a>
        </div>
      </motion.div>
    </section>
  );
}
