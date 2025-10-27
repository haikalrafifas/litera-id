'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import ContentCard from '@/components/ContentCard';

export default function ActivityCarousel({ contents }: any) {
  const centeredSlides = contents.length === 1;

  return (
    <div className="relative">
      {/* Swiper Carousel */}
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        navigation={true}
        pagination={{ clickable: true }}
        centeredSlides={centeredSlides}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        grabCursor={true}
      >
      {contents && contents.map((content: any) => (
        <SwiperSlide key={content.id}>
          <ContentCard content={content} />
        </SwiperSlide>
      ))}
    </Swiper>
    </div>
  );
}