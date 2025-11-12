'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ContentCard from '@/components/atoms/ContentCard';

export default function CardCarousel({ contents }: any) {
  const centeredSlides = contents.length === 1;

  return (
    <div className="relative w-full">
      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={3}
        navigation={true}
        pagination={{ clickable: true }}
        centeredSlides={centeredSlides}
        grabCursor={true}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
      {contents?.map((content: any) => (
        <SwiperSlide key={content.id} className="pb-16">
          <ContentCard content={content} />
        </SwiperSlide>
      ))}
    </Swiper>

    <style jsx global>{`
      .swiper-button-prev,
      .swiper-button-next {
        color: #16a34a; /* Tailwind's green-600 */
        transition: color 0.2s;
      }
      .swiper-button-prev:hover,
      .swiper-button-next:hover {
        color: #15803d; /* green-700 */
      }
      .swiper-pagination-bullet {
        background: #d1d5db; /* gray-300 */
        opacity: 1;
        transition: background 0.2s;
      }
      .swiper-pagination-bullet-active {
        background: #16a34a; /* green-600 */
        transition: background 0.2s;
      }
    `}</style>
    </div>
  );
}