import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { Mission } from '../data';
import { Camera, MapPin, CheckCircle2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ActionSubmissionProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (missionId: string) => void;
}

export function ActionSubmission({ mission, isOpen, onClose, onComplete }: ActionSubmissionProps) {
  const [step, setStep] = useState<'details' | 'submitting' | 'success'>('details');
  const [photo, setPhoto] = useState<string | null>(null);

  if (!mission) return null;

  const handleTakePhoto = () => {
    // Simulate camera
    setPhoto("https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?w=800&auto=format&fit=crop&q=60");
  };

  const handleSubmit = () => {
    setStep('submitting');
    setTimeout(() => {
      setStep('success');
      onComplete(mission.id);
      toast.success("Mission completed! +50 points");
    }, 1500);
  };

  const reset = () => {
    setStep('details');
    setPhoto(null);
    onClose();
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && reset()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        {/* iOS WebKit fix */}
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] ios-drawer-content mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none">
          <div className="sr-only">
            <Drawer.Title>Mission Submission</Drawer.Title>
            <Drawer.Description>Submit your proof of action for this mission</Drawer.Description>
          </div>
          <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-y-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            
            {step === 'details' && (
              <div className="max-w-md mx-auto space-y-6">
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <img src={mission.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <h2 className="text-2xl font-bold text-white">{mission.title}</h2>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Your Mission</h3>
                  <p className="text-gray-600 leading-relaxed">{mission.description}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-4">Proof of Action</h3>
                  
                  {!photo ? (
                    <button 
                      onClick={handleTakePhoto}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                      <Camera className="w-8 h-8" />
                      <span className="font-medium">Take Photo Evidence</span>
                    </button>
                  ) : (
                    <div className="relative h-48 rounded-xl overflow-hidden border border-gray-200">
                       <img src={photo} alt="Proof" className="w-full h-full object-cover" />
                       <button 
                         onClick={() => setPhoto(null)}
                         className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                       >
                         <X className="w-4 h-4" />
                       </button>
                       <div className="absolute bottom-2 left-2 bg-emerald-500/90 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                         <MapPin className="w-3 h-3" />
                         <span>Quezon City, Metro Manila</span>
                       </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
                   <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                     <CheckCircle2 className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="font-bold text-blue-800 text-sm">Verification Required</h4>
                     <p className="text-xs text-blue-600 mt-1">
                       Your submission will be verified by the community. GPS location is automatically tagged.
                     </p>
                   </div>
                </div>

                <button 
                  disabled={!photo}
                  onClick={handleSubmit}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all"
                >
                  Submit Activity
                </button>
              </div>
            )}

            {step === 'submitting' && (
              <div className="h-full flex flex-col items-center justify-center text-center pb-20">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-gray-800">Uploading proof...</h3>
                <p className="text-gray-500">Just a moment</p>
              </div>
            )}

            {step === 'success' && (
              <div className="h-full flex flex-col items-center justify-center text-center pb-20">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Mission Complete!</h3>
                <p className="text-gray-600 max-w-xs mb-8">
                  Great job! You've earned <span className="font-bold text-emerald-600">50 points</span> and contributed to a cleaner Philippines.
                </p>
                <button 
                  onClick={reset}
                  className="w-full max-w-xs py-3 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
