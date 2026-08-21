import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/home/Hero';
import { DoctorIntro } from '../components/home/DoctorIntro';
import { ServicesGrid } from '../components/home/ServicesGrid';
import { CounsellingSpotlight } from '../components/home/CounsellingSpotlight';
import { CareTakerSpotlight } from '../components/home/CareTakerSpotlight';
import { TeamPreview } from '../components/home/TeamPreview';
import { TestimonialsGallery } from '../components/home/TestimonialsGallery';
import { GoogleReviews } from '../components/home/GoogleReviews';
import { PartnersMarquee } from '../components/home/PartnersMarquee';
import { FindUs } from '../components/home/FindUs';

export const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Home Care Services Chennai | Nursing Care at Home Trichy Madurai | Ayusya</title>
        <meta
          name="description"
          content="Ayusya Health Care provides professional home care services, trained caretakers, nursing at home, physiotherapists, and doctor home visits in Chennai, Trichy, and Madurai."
        />
      </Helmet>

      <div className="flex-1 flex flex-col">
        {/* Sections in order */}
        <Hero />
        <DoctorIntro />
        <ServicesGrid />
        <CounsellingSpotlight />
        <div className="bg-linear-to-b from-[#2774ae] via-[#002e5d] to-[#002e5d] py-8 border-y border-white/10">
          <CareTakerSpotlight />
          <TeamPreview />
        </div>
        <TestimonialsGallery />
        <GoogleReviews />
        <PartnersMarquee />
        <FindUs />
      </div>
    </>
  );
};
