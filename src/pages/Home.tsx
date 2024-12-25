import Hero from '../components/Hero';
import FeaturedCars from '../components/FeaturedCars';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import AppDownload from '../components/AppDownload';
import RewardsSection from '../components/RewardsSection';
import { Helmet } from 'react-helmet-async';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>MissaRental - Rent Amazing Cars from Local Hosts</title>
        <meta name="description" content="Experience the freedom of driving your dream car. Rent vehicles from trusted local hosts or earn money by sharing your car." />
      </Helmet>
      
      <Hero />
      <HowItWorks />
      <FeaturedCars />
      <RewardsSection />
      <Testimonials />
      <AppDownload />
    </>
  );
}