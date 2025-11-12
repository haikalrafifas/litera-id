'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from './animations';

export default function FeaturesSection() {
  return (
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
  );
}
