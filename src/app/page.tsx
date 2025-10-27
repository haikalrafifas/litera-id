'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ContactUsButton from '@/components/ContactUsButton';
import CardCarousel from '@/components/CardCarousel';
import collectionsData from '@/database/mocks/books';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

export default function HomePage() {
  const [latestCollections] = useState(collectionsData);

  return (
  <main>
      {/* Home Section */}
      <section id="/" className="relative bg-cover bg-center py-20 mt-20 text-left" style={{ backgroundImage: 'url(/images/top-hero.jpg)' }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-white flex flex-col items-start">
          <motion.img
              src="/images/app-icon.png"
              alt="App Logo"
              className="w-36 mb-6"
              {...fadeInUp}
            />
            <motion.p
              className="mt-4 text-lg font-medium drop-shadow-md leading-relaxed"
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Aplikasi perpustakaan untuk mendigitalisasi operasional pustakawan.
            </motion.p>
        </div>

      </section>

      {/* About Us Section */}
      <section id="/about" className="bg-white md:p-16 py-16 px-4">
        <motion.div className="max-w-7xl mx-auto px-4" {...fadeInUp}>
          <div className="md:flex gap-20">
            <motion.img
              src="/images/forming-ideas.svg"
              alt="About Us"
              className="md:w-80 w-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            />
            <div>
              <h2 className="text-3xl font-semibold text-green-600 text-center">
                Tentang Kami
              </h2>
              <p className="mt-4 text-gray-600 text-justify">
                <b>Litera.id</b> hadir untuk membantu pustakawan dalam mengelola perpustakaan secara lebih efisien dan modern.
                Kami menyediakan solusi digital terpadu untuk manajemen anggota, katalog buku, dan proses peminjaman agar
                kegiatan perpustakaan menjadi lebih cepat, akurat, dan mudah diakses kapan saja.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="/features" className="bg-white md:p-16 py-16 px-4">
        <motion.div className="md:flex md:gap-20 items-start mt-10 px-4 md:px-0" {...fadeInUp}>
          <div className="md:flex-1">
            <h2 className="text-3xl font-semibold text-green-600 text-center md:text-left mb-8">
              Fitur
            </h2>

            <div className="grid gap-6 md:grid-cols-1">
              {[
                "Manajemen Anggota: Mengelola data anggota perpustakaan secara otomatis, termasuk pendaftaran, keanggotaan aktif, dan riwayat peminjaman.",
                "Manajemen Koleksi Buku: Mempermudah pustakawan dalam menambah, memperbarui, dan mengarsipkan koleksi buku secara digital.",
                "Peminjaman & Pengembalian: Mencatat transaksi peminjaman dan pengembalian buku secara cepat dan akurat, tanpa proses manual.",
                "Laporan & Statistik: Menyediakan data dan grafik tentang aktivitas perpustakaan untuk mendukung pengambilan keputusan.",
                "Akses Online: Memungkinkan pengguna mencari koleksi dan status peminjaman secara daring kapan pun dan di mana pun."
              ].map((mission, idx) => (
                <motion.div
                    key={idx}
                    className="border border-gray-300 rounded-lg p-6 shadow-sm bg-white hover:shadow-lg transition-shadow duration-300 cursor-default"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: idx * 0.15 }}
                  >
                    <div className="flex items-center mb-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <h3 className="ml-4 font-semibold text-lg text-gray-800">
                      {/* Extract title before colon */}
                      {mission.split(":")[0]}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-justify">
                    {/* Extract description after colon */}
                    {mission.split(":")[1].trim()}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.img
            src="/images/visionary-technology.svg"
            alt="Features"
            className="hidden md:block md:w-80 object-contain"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          />
        </motion.div>
      </section>

      {/* Latest Collections Section */}
      <section id="/collections" className="bg-gray-100 py-16 text-center">
        <motion.div className="max-w-7xl mx-auto px-4" {...fadeInUp}>
          <h2 className="text-3xl font-semibold text-green-600 mb-4">Koleksi Terbaru</h2>
            <CardCarousel contents={latestCollections} />
          <div className="mt-8">
            <a href="#" className="text-green-600 hover:underline">Lihat lebih banyak</a>
          </div>
        </motion.div>
      </section>
      
      <ContactUsButton />
    </main>
  );
}
