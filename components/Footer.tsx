import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 mt-auto border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} AutoSave Insurance Services. All rights reserved. <br/>
          By clicking "Get Quotes", you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </footer>
  );
};
