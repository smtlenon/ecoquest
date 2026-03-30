import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowRight, Leaf, Map, Users } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    title: 'Welcome to EcoQuest PH',
    description:
      'Build cleaner habits day by day with guided eco actions that fit your daily routine.',
    eyebrow: 'Start Fresh',
    icon: <Leaf className="w-16 h-16" />,
    accentText: 'text-emerald-700',
    accentSoft: 'from-emerald-300/35 to-emerald-50'
  },
  {
    id: 2,
    title: 'Pick Everyday Green Quests',
    description:
      'Choose practical missions in waste, energy, and transport, then build momentum through consistency.',
    eyebrow: 'Move Daily',
    icon: <Map className="w-16 h-16" />,
    accentText: 'text-teal-700',
    accentSoft: 'from-teal-300/35 to-teal-50'
  },
  {
    id: 3,
    title: 'Verify, Earn, and Share',
    description:
      'Submit photo proof, earn verified points, then redeem rewards or donate for greater impact.',
    eyebrow: 'Real Impact',
    icon: <Users className="w-16 h-16" />,
    accentText: 'text-lime-700',
    accentSoft: 'from-lime-300/35 to-lime-50'
  }
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const reduceMotion = useReducedMotion();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-linear-to-b from-[#eef8ef] via-[#f7fbf5] to-[#fffcf7] relative overflow-hidden">
      <motion.div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-300/25 blur-3xl pointer-events-none"
        animate={reduceMotion ? undefined : { x: [0, -14, 0], y: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-28 -left-20 w-64 h-64 rounded-full bg-teal-300/20 blur-3xl pointer-events-none"
        animate={reduceMotion ? undefined : { x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute top-14 right-8 w-3 h-3 rounded-sm rotate-12 bg-emerald-200/80" />
      <div className="absolute top-44 left-8 w-3.5 h-3.5 rounded-sm -rotate-6 bg-lime-200/80" />
      <div className="absolute bottom-28 left-10 w-2.5 h-2.5 rounded-full bg-teal-200/85" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -28 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative flex-1 flex flex-col w-full px-8 pt-10 pb-4"
        >
          <p className={`text-[11px] font-bold uppercase tracking-[0.22em] ${slides[currentSlide].accentText}`}>
            {slides[currentSlide].eyebrow}
          </p>

          <div className="relative mt-10 mb-8 h-20">
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -4, 0], rotate: [0, -2, 2, 0] }
              }
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className={`${slides[currentSlide].accentText}`}
            >
              {slides[currentSlide].icon}
            </motion.div>
            <div className={`absolute -inset-5 bg-linear-to-br ${slides[currentSlide].accentSoft} blur-2xl -z-10`} />
          </div>

          <h2 className="text-[2.45rem] font-extrabold text-slate-900 leading-[1.02] tracking-[-0.03em] max-w-[12ch]">
            {slides[currentSlide].title}
          </h2>

          <p className="mt-5 text-slate-700 leading-8 text-[1.07rem] max-w-[33ch]">
            {slides[currentSlide].description}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="w-full px-8 pb-7 pt-2 flex-none">
          <div className="flex justify-start gap-2 mb-6">
          {slides.map((_, index) => (
            <motion.div
              key={index} 
              layout
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-8 bg-emerald-500' : 'w-2 bg-emerald-200'
              }`}
            />
          ))}
        </div>

          <motion.button
            onClick={nextSlide}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            animate={reduceMotion ? undefined : { boxShadow: ['0 10px 24px -14px rgba(16,185,129,0.75)', '0 14px 28px -14px rgba(16,185,129,0.9)', '0 10px 24px -14px rgba(16,185,129,0.75)'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full py-4 bg-emerald-600 text-white rounded-full font-extrabold text-lg tracking-tight active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
      </div>
    </div>
  );
}
