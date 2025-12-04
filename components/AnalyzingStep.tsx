import React, { useEffect } from 'react';

interface AnalyzingStepProps {
  vehicleYear: string;
  vehicleMake: string;
  onComplete: () => void;
}

export const AnalyzingStep: React.FC<AnalyzingStepProps> = ({ vehicleYear, vehicleMake, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 bg-white animate-fadeIn">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Finding best rates...</h2>
      <div className="space-y-3 text-gray-500 text-lg">
        <p className="animate-pulse">Checking discounts for {vehicleYear} {vehicleMake}...</p>
        <p className="animate-pulse delay-1000">Verifying driver history...</p>
        <p className="animate-pulse delay-2000">Applying bundle savings...</p>
      </div>
    </div>
  );
};