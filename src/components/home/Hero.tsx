import React from 'react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  const cards = [
    {
      title: 'Elderly Caretaker',
      description: 'A senior citizen needs an assistant to their day to day activities',
      imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'Elderly assistance in daily cooking and living activities',
    },
    {
      title: 'Home Nursing',
      description: 'A senior citizen needs an assistant to take care their health care issue',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'Registered nurse providing healthcare assistance',
    },
    {
      title: 'Post Surgical Care',
      description: 'Post surgical care required when we are under chronic diseases',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'Clinical post-surgical recovery care at home',
    },
    {
      title: 'Newborn Baby Care',
      description: 'A mother needs an assistant to take care her new born baby',
      imageUrl: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'Comfortable support for newborn baby and mother',
    },
    {
      title: 'Physiotherapy Care',
      description: 'A physiotherapy care needs when we feel uncomfort situations',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'Physiotherapy rehabilitation care at home',
    },
  ];

  return (
    <section className="relative bg-linear-to-b from-[#0A3D73] to-[#05254A] py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
      {/* Decorative background vectors */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_50rem_at_top,var(--color-primary-800),transparent)]/20" />

      <div className="mx-auto max-w-7xl">
        {/* Banner Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-white text-sm sm:text-base md:text-lg font-bold tracking-widest uppercase mb-12 max-w-4xl mx-auto leading-relaxed border-b border-white/10 pb-4"
        >
          THE FOLLOWING SERVICES ARE RECOMMENDING FOR CONDITIONS WHEN :
        </motion.h2>

        {/* 5-Column Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-stretch">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col gap-4 bg-white/5 backdrop-blur-xs rounded-3xl p-4 border border-white/10 shadow-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 text-left"
            >
              {/* Image Container with rounded corners */}
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-white/10 shadow-inner">
                <img
                  src={card.imageUrl}
                  alt={card.imageAlt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Card Text Content */}
              <div className="flex-1 flex flex-col justify-start">
                <h3 className="text-white font-serif text-sm font-bold leading-snug mb-1">
                  {card.title}
                </h3>
                <p className="text-white/80 text-[11px] leading-relaxed font-medium">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
