'use client';

import { FaInstagram } from 'react-icons/fa';

export default function ContactUsButton() {
  return (
  <div className="fixed bottom-4 right-4" style={{ zIndex: 99999 }}>
    <a
      href="https://www.instagram.com/litera.id"
      target="_blank"
      rel="noopener noreferrer"
      className="relative group bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 flex items-center justify-center"
    >
      {/* Instagram Icon from FontAwesome */}
      <FaInstagram className="text-white text-3xl" />
      
      {/* Chat bubble that appears on hover */}
      <span className="absolute bottom-12 right-0 text-white bg-green-600 text-xs py-1 px-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Kunjungi Kami!
      </span>
    </a>
  </div>
  );
}
