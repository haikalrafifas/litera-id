export default function NotFoundPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white text-center px-4 overflow-hidden">
      {/* 404 logo */}
      <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 animate-pulse drop-shadow-lg">
        404
      </h1>

      {/* Message */}
      <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-wide">
        Halaman tidak ditemukan
      </h2>
      <p className="mt-2 text-gray-400 max-w-md">
        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>

      {/* Button */}
      <a
        href="/"
        className="mt-8 inline-block px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 text-white font-medium shadow-lg hover:opacity-90 transition duration-300"
      >
        Kembali ke Beranda
      </a>

      {/* Decorative glowing orbs */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
    </div>
  );
}
