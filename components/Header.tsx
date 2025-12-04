import React from 'react';

interface HeaderProps {
  progress: number;
}

export const Header: React.FC<HeaderProps> = ({ progress }) => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer">
            <span className="text-2xl font-black text-gray-900 tracking-tighter">
              Best<span className="text-emerald-500">Money.</span>
            </span>
          </div>
          <div className="flex items-center">
             <a 
                href="tel:1-800-555-0123" 
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full font-bold transition-colors flex items-center gap-2 text-sm sm:text-base shadow-md"
             >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                <span>Call An Expert</span>
             </a>
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-1.5">
        <div 
          className="bg-emerald-500 h-full transition-all duration-500 ease-out rounded-r-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </header>
  );
};