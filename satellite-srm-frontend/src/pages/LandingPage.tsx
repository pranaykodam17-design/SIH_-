import React from 'react';
import { Hero } from '../components/landing/Hero';
import { ProblemSection } from '../components/landing/ProblemSection';
import { SolutionSection } from '../components/landing/SolutionSection';
import { PipelineSection } from '../components/landing/PipelineSection';
import { ApplicationsSection } from '../components/landing/ApplicationsSection';
import { WhySRMSection } from '../components/landing/WhySRMSection';
import { TechnologySection } from '../components/landing/TechnologySection';
import { FinalCTA } from '../components/landing/FinalCTA';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <PipelineSection />
      <ApplicationsSection />
      <WhySRMSection />
      <TechnologySection />
      <FinalCTA />
    </div>
  );
};
