import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FilmingControlsProps {
  onFreshStart: () => void;
  onHeroState: () => void;
}

export function FilmingControls({ onFreshStart, onHeroState }: FilmingControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const holdTimeoutRef = useRef<number | null>(null);

  const clearHoldTimer = () => {
    if (holdTimeoutRef.current !== null) {
      window.clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  };

  const startHoldTimer = () => {
    clearHoldTimer();
    holdTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(true);
    }, 1500);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-2 w-72 rounded-2xl bg-white p-4 shadow-xl"
          >
            <button
              onClick={onFreshStart}
              className="w-full rounded-xl px-3 py-2 text-left hover:bg-[#F5FBF8]"
            >
              <p className="text-sm font-semibold text-[#1E9E63]">Fresh start</p>
              <p className="text-xs text-[#5A6A62]">Resets everything. Use for Drei&apos;s first open.</p>
            </button>

            <button
              onClick={onHeroState}
              className="mt-2 w-full rounded-xl px-3 py-2 text-left hover:bg-[#F5FBF8]"
            >
              <p className="text-sm font-semibold text-[#1E9E63]">Hero state</p>
              <p className="text-xs text-[#5A6A62]">Loads full points + completed missions. Use for reward scene.</p>
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-3 w-full rounded-xl border border-[#DDE5E0] px-3 py-2 text-sm font-medium text-[#5A6A62]"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        onTouchStart={startHoldTimer}
        onTouchEnd={clearHoldTimer}
        onTouchCancel={clearHoldTimer}
        className="h-7 w-7 rounded-full bg-[#DDF5E7] text-[#1E9E63] shadow-sm"
        aria-label="Open filming controls"
      >
        <svg viewBox="0 0 24 24" className="mx-auto h-4 w-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.9 3.5c3.4 1.1 5.4 4.7 4.3 8.1-1.1 3.4-4.7 5.4-8.1 4.3-3.4-1.1-5.4-4.7-4.3-8.1 1.1-3.4 4.7-5.4 8.1-4.3Zm0 0c-.8 2.2-2.5 4.1-4.8 5.2 2.3-.2 4.6.5 6.5 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
