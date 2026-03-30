import { Leaf, Sparkles } from 'lucide-react';

interface OpeningPageProps {
  onStart: () => void;
}

export function OpeningPage({ onStart }: OpeningPageProps) {
  return (
    <section className="relative grid h-full w-full grid-rows-[1fr_auto] overflow-hidden bg-[#F5FBF4] px-7 pb-8 pt-8 text-[#1E2A24]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-[#DDF5E7] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#ECF8F0] to-transparent" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div
          className="cinema-fade-up inline-flex items-center gap-2 rounded-full border border-[#BFEAD1] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1E9E63]"
          style={{ animationDelay: '0.2s' }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Welcome
        </div>

        <div
          className="cinema-pop-in mt-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6BF3B1] to-[#19B875] text-[#0f2a1f] shadow-[0_14px_28px_rgba(30,158,99,0.25)]"
          style={{ animationDelay: '0.45s' }}
        >
          <Leaf className="h-10 w-10" />
        </div>

        <h1
          className="cinema-fade-up mt-7 text-5xl font-extrabold leading-[0.95] tracking-[-0.03em]"
          style={{ animationDelay: '0.85s' }}
        >
          EcoQuest
        </h1>

        <p
          className="cinema-fade-up mt-5 max-w-[28ch] text-base leading-7 text-[#5A6A62]"
          style={{ animationDelay: '1.15s' }}
        >
          Turn small daily eco actions into visible impact and rewards.
        </p>
      </div>

      <div className="relative z-10">
        <button
          type="button"
          onClick={onStart}
          className="cinema-fade-in min-h-[48px] w-full rounded-full bg-[#1E9E63] px-5 py-4 text-lg font-bold text-white transition hover:bg-[#178A55]"
          style={{ animationDelay: '1.55s' }}
        >
          Start Journey
        </button>
      </div>
    </section>
  );
}
