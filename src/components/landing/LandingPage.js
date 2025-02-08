'use client'
import HeroSection from './HeroSection'
import FeatureSection from './FeatureSection'
import StatisticsSection from './StatisticsSection'
import TestimonialSection from './TestimonialSection'
import CTASection from './CTASection'

export default function LandingPage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <FeatureSection />
      <StatisticsSection />
      <TestimonialSection />
      <CTASection />
    </div>
  )
}