import React from 'react';
import Hero from '../components/Sections/Hero';
import WhatIs from '../components/Sections/WhatIs';
import Benefits from '../components/Sections/Benefits';
import Certifications from '../components/Sections/Certifications';
import TreatmentAreas from '../components/Sections/TreatmentAreas';
import Promotion from '../components/Sections/Promotion';
import Care from '../components/Sections/Care';
import Testimonials from '../components/Sections/Testimonials';
import Contact from '../components/Sections/Contact';
import FinalCTA from '../components/Sections/FinalCTA';

const HomePage = () => {
  return (
    <div className="pt-16">
      <Hero />
      <WhatIs />
      <Benefits />
      <Certifications />
      <TreatmentAreas />
      <Promotion />
      <Care />
      <Testimonials />
      <Contact />
      <FinalCTA />
    </div>
  );
};

export default HomePage;