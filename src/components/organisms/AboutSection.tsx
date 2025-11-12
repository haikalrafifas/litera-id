'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from './animations';

export default function AboutSection() {
  return (
    <section id="/about" className="bg-gray-50 py-20 px-6 md:px-8">
      <motion.div
        className="max-w-5xl mx-auto text-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl font-semibold text-green-600 mb-8">
          Tentang Kami
        </h2>
        <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          <b>Litera.id</b> hadir untuk membantu pustakawan dalam mengelola perpustakaan secara lebih efisien dan modern.
          Kami menyediakan solusi digital terpadu untuk manajemen anggota, katalog buku, dan proses peminjaman agar
          kegiatan perpustakaan menjadi lebih cepat, akurat, dan mudah diakses kapan saja.
        </p>
      </motion.div>
    </section>
  );
}
