import Image from 'next/image';
import { motion } from 'framer-motion';
import { normalizeUploadPath } from '@/utilities/client/path';
import type Book from '@/domains/book/model';

export default function ContentCard({ books }: { books: Book[] }) {
  return (
  // <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col">
  //   <img
  //     src={content.image}
  //     alt={content.title}
  //     className="w-full object-cover rounded-md"
  //     width={16}
  //     height={16}
  //   />
  //   <h3 className="text-xl font-semibold text-green-600 mt-4 text-center">
  //     {content.title}
  //   </h3>
  //   <p className="mt-4 text-gray-600 text-center line-clamp-3 min-h-[4.5rem] loading-relaxed">
  //     {content.snippets}
  //     </p>
  // </div>

  <div className="bg-white">
    {books && books.map((book: Book, idx: number) => (
      <motion.a
        key={book.isbn}
        href={`/books/${book.isbn}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: idx * 0.1 }}
        className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      >
        {/* Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {book.image ? (
            <Image
              src={normalizeUploadPath(book.image)}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50">
              <svg className="w-16 h-16 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          )}
          
          {/* Status Badge */}
          {/* <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              book.status === 'approved' 
                ? 'bg-green-500/90 text-white' 
                : book.status === 'pending'
                ? 'bg-yellow-500/90 text-white'
                : 'bg-green-500/90 text-white'
            }`}>
              {book.status === 'approved' ? 'Disetujui' : book.status === 'pending' ? 'Menunggu' : 'Ditolak'}
            </span>
          </div> */}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
            {book.title}
          </h3>

          {/* Metadata */}
          <div className="space-y-2 mb-4">
            {book.published_at && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(book.published_at).toLocaleDateString('id-ID', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
            )}
            
            {book.author && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="line-clamp-1">{book.author}</span>
              </div>
            )}
            
            {book.category && (
              <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>{book.category}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {/* {book.description && (
            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
              {book.description}
            </p>
          )} */}

          {/* Read More Link */}
          <div className="flex items-center gap-2 text-green-600 font-semibold text-sm group-hover:gap-3 transition-all">
            <span>Lihat Detail</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </motion.a>
    ))}
  </div>
  );
}
