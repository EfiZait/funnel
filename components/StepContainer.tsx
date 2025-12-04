import React from 'react';

interface StepContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
}

export const StepContainer: React.FC<StepContainerProps> = ({ 
  title, 
  subtitle, 
  children, 
  onBack, 
  showBack = true 
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeIn px-4 pb-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Card Header Area */}
        <div className="pt-8 px-6 sm:px-10 pb-4 relative">
          {showBack && onBack && (
            <button 
              onClick={onBack}
              className="absolute left-4 top-8 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              title="Go Back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-center text-gray-500 text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {/* Card Content Area */}
        <div className="p-6 sm:p-10 pt-2">
          {children}
        </div>
      </div>

      {/* Trust Badges - Minimal */}
      <div className="mt-8 flex justify-center items-center space-x-6 text-gray-400 opacity-60">
         <div className="flex items-center space-x-1">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
             <span className="text-xs font-semibold uppercase tracking-wider">Secure</span>
         </div>
         <div className="flex items-center space-x-1">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
             <span className="text-xs font-semibold uppercase tracking-wider">Verified</span>
         </div>
      </div>
    </div>
  );
};