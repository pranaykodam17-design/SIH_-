import React from 'react';
import {
  Navbar,
  Hero,
  Challenge,
  Pipeline,
  Multispectral,
  BeforeAfter,
  Visualization,
  CTA,
  Footer,
} from '../components/landing';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#10233F] overflow-x-hidden selection:bg-[#1677FF]/20 selection:text-cyan-900">
      {/* 1. Fixed Transparent Glass Navbar */}
      <Navbar />

      {/* 2. Hero Section with 3D EarthScene */}
      <main className="flex-1 flex flex-col">
        <Hero />

        {/* 3. Section 1: The Challenge */}
        <Challenge />

        {/* 4. Section 2: Our Approach (Pipeline) */}
        <Pipeline />

        {/* 5. Section 3: Multispectral Data (4 Band Cards) */}
        <Multispectral />

        {/* 6. Section 4: Before / After Slider */}
        <BeforeAfter />

        {/* 7. Section 5: 3D Visualization */}
        <Visualization />

        {/* 8. Section 6: Platform CTA */}
        <CTA />
      </main>

      {/* 9. TerraSR Landing Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
