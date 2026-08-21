import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomeFeaturedTeamMembers, TeamMember } from '../../lib/queries/team';
import { User, Award, ArrowRight } from 'lucide-react';
import { AnimatedSection } from '../shared/AnimatedSection';

const fallbackTeam: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. M.C Deepak',
    qualification: 'M.D',
    specialty: 'Sr. Diabetologist',
    role_tag: 'Senior Clinical Associate',
    photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    featured_on_home: true,
    display_order: 1,
    created_at: '',
  },
  {
    id: '2',
    name: 'Dr. Ravindra Nath',
    qualification: 'M.B.B.S, M.D',
    specialty: 'Sr. General Physician',
    role_tag: 'Senior Clinical Associate',
    photo_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    featured_on_home: true,
    display_order: 2,
    created_at: '',
  },
  {
    id: '3',
    name: 'Dr. Vamsi Krishna',
    qualification: 'M.B.B.S, M.S',
    specialty: 'General & Laparoscopic Surgeon',
    role_tag: 'Clinical Associate',
    photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
    featured_on_home: true,
    display_order: 3,
    created_at: '',
  },
  {
    id: '4',
    name: 'Dr. SSK. Sandeep',
    qualification: 'M.S (Ortho)',
    specialty: 'Orthopaedic Specialist',
    role_tag: 'Clinical Associate',
    photo_url: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=300&q=80',
    featured_on_home: true,
    display_order: 4,
    created_at: '',
  },
  {
    id: '5',
    name: 'Dr. Roshan Kumar',
    qualification: 'M.D (Pulmonary Medicine)',
    specialty: 'Pulmonary Specialist',
    role_tag: 'Clinical Associate',
    photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    featured_on_home: true,
    display_order: 5,
    created_at: '',
  },
];

export const TeamPreview: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedTeam() {
      try {
        const data = await getHomeFeaturedTeamMembers();
        if (data && data.length > 0) {
          setMembers(data);
        } else {
          setMembers(fallbackTeam);
        }
      } catch (err) {
        console.error('Failed to load featured team, using fallback', err);
        setMembers(fallbackTeam);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedTeam();
  }, []);

  return (
    <section className="pt-6 pb-12 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection className="max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-bold text-primary-300 uppercase tracking-widest block">
            Medical Panel
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Our Clinical Associates
          </h2>
          <p className="text-sm sm:text-base text-primary-100 leading-relaxed max-w-2xl mx-auto">
            Experienced diabetologists, general physicians, surgeons, orthopedics, and pulmonologists advising our home-care protocols.
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg">
                <div className="shimmer h-40 w-full rounded-2xl bg-white/10 mb-4"></div>
                <div className="shimmer h-4 w-2/3 rounded bg-white/10 mb-2"></div>
                <div className="shimmer h-3.5 w-full rounded bg-white/10"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 text-left">
            {members.slice(0, 5).map((member) => (
              <AnimatedSection
                key={member.id}
                direction="up"
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Photo container styled like Hero cards */}
                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-white/10 flex items-center justify-center p-2 border border-white/10">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-103"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/5 text-primary-300">
                        <User className="h-10 w-10" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 rounded-lg bg-warm-900/85 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                      {member.role_tag}
                    </span>
                  </div>

                  {/* Profile info */}
                  <div className="space-y-1">
                    <h3 className="font-serif text-sm font-bold text-white leading-tight">
                      {member.name}
                    </h3>
                    {member.qualification && (
                      <p className="text-[11px] font-bold text-primary-200">{member.qualification}</p>
                    )}
                    <p className="text-[11px] font-semibold text-primary-300 uppercase tracking-wide">
                      {member.specialty}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4">
                  <Link
                    to="/team/clinical-associates"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-300 hover:text-white outline-none transition-colors"
                  >
                    Know More
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link
            to="/team/clinical-associates"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary-950 hover:bg-primary-50 transition-colors shadow-md outline-none"
          >
            Meet All Clinical Associates
          </Link>
        </div>
      </div>
    </section>
  );
};
