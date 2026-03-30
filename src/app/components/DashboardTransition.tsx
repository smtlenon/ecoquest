import { Leaf } from 'lucide-react';

export function DashboardTransition() {
  return (
    <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#F5FBF4] px-7 text-[#1E2A24]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#DDF5E7] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#ECF8F0] to-transparent" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6BF3B1] to-[#19B875] text-[#0f2a1f] shadow-[0_14px_28px_rgba(30,158,99,0.25)]">
          <Leaf className="h-10 w-10 animate-[spin_8s_linear_infinite]" />
        </div>

        <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#1E9E63]">Entering EcoQuest</h2>

        <div className="mt-8 w-56">
          <div className="h-2.5 overflow-hidden rounded-full bg-[#DDF5E7]/90 ring-1 ring-[#CDECD9] shadow-inner">
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <div className="eco-progress-indeterminate absolute inset-y-0 rounded-full bg-gradient-to-r from-[#3BDA94] via-[#21BC78] to-[#1E9E63]" />
              <div className="eco-progress-indeterminate-secondary absolute inset-y-0 rounded-full bg-gradient-to-r from-[#65E3AB]/80 via-[#2AC683]/80 to-[#1E9E63]/80" />
              <div className="eco-progress-sheen pointer-events-none absolute inset-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
