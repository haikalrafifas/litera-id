'use client';

import HeroSection from '@/components/organisms/HeroSection';
import AboutSection from '@/components/organisms/AboutSection';
import FeaturesSection from '@/components/organisms/FeaturesSection';
import LatestCollectionsSection from '@/components/organisms/LatestCollectionsSection';
import ContactUsButton from '@/components/atoms/ContactUsButton';

export default function HomePage() {
  return (
    <main className="font-sans text-gray-700 bg-white">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <LatestCollectionsSection />
      <ContactUsButton />
    </main>
  );
}
