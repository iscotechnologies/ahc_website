import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/home/Hero';
import { DoctorIntro } from '../components/home/DoctorIntro';
import { ServicesGrid } from '../components/home/ServicesGrid';
import { TeamPreview } from '../components/home/TeamPreview';
import { PatientStoriesAndReviews } from '../components/home/PatientStoriesAndReviews';
import { PartnersMarquee } from '../components/home/PartnersMarquee';
import { FindUs } from '../components/home/FindUs';

export const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Home Care Services Chennai | Nursing Care at Home Chennai & Madurai | Ayusya</title>
        <meta
          name="description"
          content="Ayusya Health Care provides professional home care services, trained caretakers, nursing at home, physiotherapists, and doctor home visits in Chennai and Madurai."
        />
      </Helmet>

      <div className="flex-1 flex flex-col">
        {/* Sections in order */}
        <Hero />
        <DoctorIntro />
        <ServicesGrid />
        <div className="bg-linear-to-b from-[#2774ae] via-[#002e5d] to-[#002e5d] py-8 border-y border-white/10">
          <TeamPreview />
        </div>
        <PatientStoriesAndReviews />
        <PartnersMarquee />
        <FindUs />
      </div>
    </>
  );
};
