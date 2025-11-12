'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from './animations';

export default function HeroSection() {
  return (
    <section
      id="/"
      className="relative h-[85vh] md:h-[90vh] overflow-hidden flex items-center justify-start mt-14"
    >
      {/* Background Hero */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[6000ms] ease-out"
        style={{ backgroundImage: `url(/images/top-hero.jpg)` }}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 1 }}
      />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-[1]" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-white drop-shadow-lg justify-items-center">
        <motion.img
          src="/images/app-icon.png"
          alt="App Icon"
          className="w-40 mb-6"
          {...fadeInUp}
        />
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold max-w-3xl leading-tight text-balance"
          {...fadeInUp}
          transition={{ delay: 0.1 }}
        >
          Litera.id
        </motion.h1>
        <motion.p
          className="mt-6 max-w-7xl text-lg md:text-xl leading-relaxed text-gray-200 text-center"
          {...fadeInUp}
          transition={{ delay: 0.2 }}
        >
          Aplikasi perpustakaan untuk mendigitalisasi operasional pustakawan.
        </motion.p>

        {/* CTA */}
        <motion.div
          {...fadeInUp}
          className="flex flex-col md:flex-row items-center gap-4 justify-center mt-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto"
          >
            <a
              href="#/about"
              className="inline-block w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 text-center"
            >
              Pelajari Lebih Lanjut
            </a>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto"
          >
            <a
              href="/auth/login"
              className="inline-block w-full md:w-auto bg-white hover:bg-gray-100 text-green-600 font-semibold py-3 px-8 rounded-lg shadow border border-green-200 transition-all duration-300 text-center"
            >
              Masuk
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,83.29C906.67,117.94,823.78,135,740,120,656.22,105,573.33,58,489.55,41.8,405.77,25.6,322.89,39.16,239.11,63.18,155.33,87.2,72.44,121.67,0,120V0H1200V27.35C1127.56,49.19,1064.64,48.65,985.66,83.29Z"
            fill="#f9fafb"
          ></path>
        </svg>
      </div>
    </section>
  );
}
