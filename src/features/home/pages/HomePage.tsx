import { TopRatedServicesSection } from '@/features/public-services/components/TopRatedServicesSection';

import { HomeAboutPreviewSection } from '../components/HomeAboutPreviewSection';
import { HomeHeroSection } from '../components/HomeHeroSection';
import { HomeReviewsSection } from '../components/HomeReviewsSection';

export function HomePage() {
  return (
    <main>
      <HomeHeroSection />
      <TopRatedServicesSection />
      <HomeReviewsSection />
      <HomeAboutPreviewSection />
    </main>
  );
}
