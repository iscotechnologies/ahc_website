import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getTeamMembers, TeamMember } from '../lib/queries/team';
import { getHospitals, Hospital } from '../lib/queries/hospitals';
import { User, Award, ShieldAlert, Building2, CheckCircle2, ChevronRight, Activity, Beaker } from 'lucide-react';
import { Link } from 'react-router-dom';

import { AnimatedSection } from '../components/shared/AnimatedSection';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';

const fallbackTeam: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Roshan Kumar',
    qualification: 'M.D',
    specialty: 'SR. DIABETOLOGIST',
    role_tag: 'Senior Clinical Associate',
    photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. M.C Deepak is an experienced diabetologist who focuses on holistic management of type-1 and type-2 diabetes, gestational diabetes, and associated metabolic complications.',
    featured_on_home: true,
    display_order: 1,
    created_at: '',
  },
  {
    id: '2',
    name: 'Dr. Ravindra Nath',
    qualification: 'M.B.B.S, M.D',
    specialty: 'SR. GENERAL PHYSICIAN',
    role_tag: 'Senior Clinical Associate',
    photo_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Ravindra Nath provides primary medical care with a specialization in geriatric health, chronic disease management, and preventative clinical diagnoses.',
    featured_on_home: true,
    display_order: 2,
    created_at: '',
  },
  {
    id: '3',
    name: 'Dr. Vamsi Krishna',
    qualification: 'M.B.B.S, M.S',
    specialty: 'GENERAL & LAPAROSCOPIC SURGEON',
    role_tag: 'Clinical Associate',
    photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Vamsi Krishna is an accomplished surgeon specializing in minimally invasive laparoscopic procedures and surgical consultations for home recovery.',
    featured_on_home: true,
    display_order: 3,
    created_at: '',
  },
  {
    id: '4',
    name: 'Dr. SSK. Sandeep',
    qualification: 'M.S (Ortho)',
    specialty: 'ORTHOPAEDIC SPECIALIST',
    role_tag: 'Clinical Associate',
    photo_url: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. SSK. Sandeep expertises in joint replacement therapies, trauma care, and managing orthopedic patients requiring post-op home care and physical rehabilitation.',
    featured_on_home: true,
    display_order: 4,
    created_at: '',
  },
  {
    id: '5',
    name: 'Dr. Roshan Kumar',
    qualification: 'M.D (Pulmonary Medicine)',
    specialty: 'PULMONARY SPECIALIST',
    role_tag: 'Clinical Associate',
    photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bio: 'Dr. Roshan Kumar coordinates respiratory therapy programs, chronic obstructive pulmonary disease (COPD) care, and respiratory support equipment setups.',
    featured_on_home: true,
    display_order: 5,
    created_at: '',
  },
];

const fallbackHospitals: Hospital[] = [
  {
    id: '1',
    name: 'MedIndia Hospitals – Chennai',
    subtitle: 'Chain of Super Specialty Digestive Disease Institutions',
    description: 'MedIndia Hospitals (a unit of MedIndia Institute of Medical Specialities) is a chain of digestive disease institutions of international repute equipped with state of the art diagnostics, surgical facilities and medical professionals. Offering comprehensive G.I. care on par with international standard under one roof, it was the first to conceive and execute the Esophageal Lab and Intensive Digestive Care Unit (IDCU).',
    more_info: 'A pioneering teaching and training center, MedIndia has organized over 140 Weekly Scientific meetings for City based Gastroenterologists and multiple international endoscopy crash courses, training over 300 doctors in basic and advanced endoscopy techniques.',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    display_order: 1
  },
  {
    id: '2',
    name: 'Vasanthi Orthopaedic Hospital (VOH)',
    subtitle: '30+ Years of Orthopaedic Excellence (50+ Beds)',
    description: 'Vasanthi Orthopaedic Hospital is one of the most respected healthcare providers in Chennai. Founded by Dr. R.H. Govardhan (who has conducted 2,000+ surgeries), VOH specialises in arthroscopy, trauma recovery, spinal injuries, and complicated joint replacement.',
    more_info: 'VOH offers dedicated treatments in all minor and major osteoarthritic issues. A leading treatment module includes platelet-rich plasma transfusion for patients with osteoarthritis. Their multidisciplinary team of anaesthesiologists, rheumatologists, and rehab experts ensure a smooth recovery.',
    image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    display_order: 2
  },
  {
    id: '3',
    name: 'Star Bone and Joint Specialty Hospitals',
    subtitle: 'Leading Bone and Joint Healthcare Provider (50+ Beds)',
    description: 'Star Bone and Joint Hospital is a highly experienced healthcare provider in Chennai with over 30 years of clinical practice. Founded by Dr. Amarnath Sowlee (who has conducted 1,500+ orthopaedic surgeries), the hospital is located in the heart of Chennai City.',
    more_info: 'The Orthopaedic and Joint Replacement department deals with trauma recovery, spinal injuries, minimally invasive bone restructuring, and joint replacement. Their specialized team coordinates home physical therapy and postoperative mobility programs in partnership with Ayusya.',
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    display_order: 3
  }
];

export const ClinicalAssociates: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [hospitalPartners, setHospitalPartners] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'doctors' | 'hospitals' | 'affiliates'>('doctors');

  useEffect(() => {
    async function loadData() {
      try {
        const [teamData, hospitalsData] = await Promise.allSettled([
          getTeamMembers(),
          getHospitals()
        ]);

        if (teamData.status === 'fulfilled' && teamData.value && teamData.value.length > 0) {
          setMembers(teamData.value);
        } else {
          setMembers(fallbackTeam);
        }

        if (hospitalsData.status === 'fulfilled' && hospitalsData.value && hospitalsData.value.length > 0) {
          setHospitalPartners(hospitalsData.value);
        } else {
          setHospitalPartners(fallbackHospitals);
        }
      } catch (err) {
        console.error('Failed to load clinical associate page data, using fallbacks', err);
        setMembers(fallbackTeam);
        setHospitalPartners(fallbackHospitals);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const affiliates = [
    {
      name: 'Dr. A.R. Jagathraman',
      qual: 'M.B. M.S., Gen.M.Ch. Neuro FICS.',
      spec: 'Sr. Neuro Surgeon & Consultant',
      type: 'Specialist Surgeon',
    },
    {
      name: 'Aishwariya Clinical Laboratory',
      location: 'Chennai',
      spec: 'Home Blood Sample Collection & Lab Diagnostics',
      type: 'Diagnostic Laboratory',
    },
    {
      name: 'Neuro Surgical Clinic',
      location: 'Chennai',
      spec: 'Post-discharge Neurosurgical consultation and care audits',
      type: 'Clinical Partner',
    },
    {
      name: 'Ess. Vee. Hospital',
      location: 'Chennai',
      spec: 'General clinical care coordination & emergency backups',
      type: 'Hospital Partner',
    },
    {
      name: 'Billroth Hospitals',
      location: 'Chennai',
      spec: 'Multi-specialty hospital referrals and home care extension',
      type: 'Hospital Partner',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Our Clinical Associates & Hospital Partners | Ayusya Health Care</title>
        <meta
          name="description"
          content="Ayusya Health Care works closely with MedIndia Hospitals, Vasanthi Orthopaedic, Star Bone & Joint, Billroth Hospitals, and leading surgeons in Chennai, Trichy, and Madurai."
        />
      </Helmet>

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-[#2774ae] via-[#002e5d] to-[#002e5d] text-white border-y border-white/10">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-primary-300 uppercase tracking-widest block">
              Professional Panel
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-none">
              Our Clinical Associates
            </h1>
            <p className="text-sm sm:text-base text-primary-100 leading-relaxed">
              We coordinate with leading multi-specialty hospitals, diagnostic labs, and medical experts to extend clinical supervision and post-discharge care directly to patients' homes.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center border-b border-white/10">
            <div className="flex gap-2 sm:gap-6">
              <button
                onClick={() => setActiveTab('doctors')}
                className={`pb-4 text-sm font-semibold transition-all outline-none border-b-2 cursor-pointer ${
                  activeTab === 'doctors'
                    ? 'border-white text-white font-bold'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                Medical Advisory Panel
              </button>
              <button
                onClick={() => setActiveTab('hospitals')}
                className={`pb-4 text-sm font-semibold transition-all outline-none border-b-2 cursor-pointer ${
                  activeTab === 'hospitals'
                    ? 'border-white text-white font-bold'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                Partner Hospitals
              </button>
              <button
                onClick={() => setActiveTab('affiliates')}
                className={`pb-4 text-sm font-semibold transition-all outline-none border-b-2 cursor-pointer ${
                  activeTab === 'affiliates'
                    ? 'border-white text-white font-bold'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                Associated Clinics & Labs
              </button>
            </div>
          </div>

          {/* TAB 1: Advisory Panel Doctors */}
          {activeTab === 'doctors' && (
            <div className="space-y-8">
              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-left">
                  {members.map((member, index) => (
                    <AnimatedSection
                      key={member.id}
                      direction="up"
                      delay={index * 0.05}
                      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xs"
                    >
                      <div className="space-y-6">
                        <div className="flex gap-4 items-center">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center p-1">
                            {member.photo_url ? (
                              <img
                                src={member.photo_url}
                                alt={member.name}
                                className="h-full w-full object-contain rounded-xl"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/50">
                                <User className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <span className="inline-block rounded bg-warm-900/80 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                              {member.role_tag}
                            </span>
                            <h3 className="font-serif text-lg font-bold text-white leading-tight">
                              {member.name}
                            </h3>
                            {member.qualification && (
                              <p className="text-[11px] font-bold text-primary-200 leading-none">
                                {member.qualification}
                              </p>
                            )}
                            <p className="text-[11px] font-bold text-primary-300 uppercase tracking-wide">
                              {member.specialty}
                            </p>
                          </div>
                        </div>

                        {member.bio && (
                          <p className="text-xs text-primary-100 leading-relaxed border-t border-white/10 pt-4 italic">
                            "{member.bio}"
                          </p>
                        )}
                      </div>

                      <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-primary-200">
                          <Award className="h-4 w-4 text-amber-400" />
                          <span>Verified Associate</span>
                        </div>
                        <Link
                          to="/contact"
                          className="inline-flex items-center gap-1 rounded-xl bg-white px-4 py-2 text-xs font-bold text-primary-950 hover:bg-primary-50 transition-colors outline-none"
                        >
                          Consult Doctor
                        </Link>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Partner Hospitals */}
          {activeTab === 'hospitals' && (
            <div className="space-y-12 text-left">
              {/* Introduction Card */}
              <AnimatedSection direction="up" className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-lg space-y-4 backdrop-blur-xs">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <Building2 className="h-7 w-7 text-primary-300" />
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Hospital Network Program</h2>
                </div>
                <p className="text-sm text-primary-100 leading-relaxed">
                  We work closely with a large number of multi-specialty hospitals that are highly interested in extending their medical care into patients' homes. Through our partnership, we provide additional benefits:
                </p>
                <div className="grid gap-4 sm:grid-cols-2 pt-2 text-xs text-white">
                  <div className="flex gap-2.5 items-start bg-white/5 rounded-2xl p-4 border border-white/10">
                    <CheckCircle2 className="h-5 w-5 text-primary-300 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white mb-1">Reducing Hospital Length of Stay</h4>
                      <p className="leading-relaxed text-primary-100">Freeing up valuable beds for incoming acute patients while safely transitioning chronic cases to home recovery.</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start bg-white/5 rounded-2xl p-4 border border-white/10">
                    <CheckCircle2 className="h-5 w-5 text-primary-300 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white mb-1">Extending Hospital Service Delivery</h4>
                      <p className="leading-relaxed text-primary-100">Providing a premium, coordinated medical service straight to patients' doorsteps under their original doctors' instructions.</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Detailed Hospital Cards */}
              <div className="space-y-8">
                {hospitalPartners.map((hospital, index) => (
                  <AnimatedSection
                    key={hospital.id || index}
                    direction="up"
                    delay={index * 0.05}
                    className="flex flex-col md:flex-row gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xs"
                  >
                    <div className="w-full md:w-1/3 h-52 md:h-auto overflow-hidden rounded-2xl bg-white/10">
                      <img
                        src={hospital.image_url}
                        alt={hospital.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-primary-300 uppercase tracking-widest block">
                          Super-Specialty Network
                        </span>
                        <h3 className="font-serif text-xl font-bold text-white leading-tight">
                          {hospital.name}
                        </h3>
                        <p className="text-xs font-semibold text-primary-200 leading-none">
                          {hospital.subtitle}
                        </p>
                        <p className="text-xs text-primary-100 leading-relaxed pt-2">
                          {hospital.description}
                        </p>
                        <p className="text-xs text-white/70 leading-relaxed border-t border-white/10 pt-3 italic">
                          {hospital.more_info}
                        </p>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <Link
                          to="/contact/referral-partner"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-300 hover:text-white hover:underline outline-none transition-colors"
                        >
                          <span>Coordinate Admissions</span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Associated Clinics & Labs */}
          {activeTab === 'affiliates' && (
            <div className="space-y-6 text-left">
              <AnimatedSection direction="up" className="grid gap-4 sm:grid-cols-2">
                {/* Dr. A.R. Jagathraman Profile Box */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg flex flex-col justify-between space-y-4 backdrop-blur-xs">
                  <div className="space-y-2">
                    <span className="rounded-lg bg-white/10 px-2 py-0.5 text-[9px] font-bold text-white/95 uppercase tracking-wider">
                      Senior Consultant
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Dr. A.R. Jagathraman
                    </h3>
                    <p className="text-xs font-bold text-primary-200">M.B. M.S., Gen.M.Ch. Neuro FICS.</p>
                    <p className="text-xs text-primary-300 font-bold uppercase tracking-wide">
                      Sr. Neuro Surgeon & Consultant
                    </p>
                    <p className="text-xs text-primary-100 leading-relaxed pt-2 border-t border-white/10">
                      Consulting advisor for post-surgical neuro rehabilitation, spinal recovery, and trauma care programs.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/contact"
                      className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-primary-950 hover:bg-primary-50 transition-colors inline-block"
                    >
                      Book Consultation
                    </Link>
                  </div>
                </div>

                {/* General Affiliates List */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg space-y-4 backdrop-blur-xs">
                  <h3 className="font-serif text-base font-bold text-white border-b border-white/10 pb-2">
                    Associated Clinics & Institutions
                  </h3>
                  <div className="space-y-3.5">
                    {affiliates.slice(1).map((affiliate, idx) => (
                      <div key={idx} className="flex gap-3.5 items-start text-xs border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white mt-0.5">
                          {affiliate.type === 'Diagnostic Laboratory' ? (
                            <Beaker className="h-4 w-4" />
                          ) : (
                            <Activity className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-white leading-tight">{affiliate.name}</h4>
                          <p className="text-[10px] text-primary-300 font-medium mt-0.5">{affiliate.location} • {affiliate.type}</p>
                          <p className="text-[11px] text-primary-100 leading-relaxed mt-1">{affiliate.spec}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          )}

          {/* Medical disclaimer */}
          <AnimatedSection direction="up" className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 flex gap-4 items-start max-w-3xl mx-auto text-left">
            <ShieldAlert className="h-6 w-6 text-amber-450 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white font-serif">Clinical Associates Disclaimer</h4>
              <p className="text-xs text-amber-100 leading-relaxed font-sans font-medium">
                Our clinical associates serve as advisory consultants and practitioners coordinating physical consults and audits. They do not replace 24/7 hospital emergency rooms. In acute medical crises, please transport the patient to nearest emergency hospital.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
};
