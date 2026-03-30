import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Leaf, Map, Users } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    title: "Welcome to EcoQuest PH",
    description: "Join thousands of Filipino students making a difference for our environment, one quest at a time.",
    icon: <Leaf className="w-16 h-16 text-emerald-500" />,
    color: "bg-emerald-50"
  },
  {
    id: 2,
    title: "Complete Daily Missions",
    description: "Take on real-world challenges like waste segregation, planting, and cleanups to earn points.",
    icon: <Map className="w-16 h-16 text-teal-500" />,
    color: "bg-teal-50"
  },
  {
    id: 3,
    title: "Climb the Leaderboard",
    description: "Compete with friends and schools. Show off your badges and achievements on your profile.",
    icon: <Users className="w-16 h-16 text-lime-500" />,
    color: "bg-lime-50"
  }
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={`flex-1 flex flex-col items-center justify-center w-full p-8 ${slides[currentSlide].color}`}
        >
          <div className="mb-8 p-6 bg-white rounded-full shadow-lg shadow-emerald-100/50">
            {slides[currentSlide].icon}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4 leading-tight">
            {slides[currentSlide].title}
          </h2>
          <p className="text-gray-600 text-center max-w-xs text-lg">
            {slides[currentSlide].description}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="w-full bg-white p-8 pb-12 rounded-t-3xl -mt-6 z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-emerald-500" : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-emerald-700"
        >
          {currentSlide === slides.length - 1 ? "Start Your Quest" : "Next"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
