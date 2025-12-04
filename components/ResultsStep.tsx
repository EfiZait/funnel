import React from 'react';
import { LeadData } from '../types';

interface ResultsStepProps {
  data: LeadData;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({ data }) => {
  const insuranceProviders = [
    {
      name: "Liberty Mutual",
      description: "Customized coverage so you only pay for what you need.",
      points: [
        `Great protection plans for a ${data.vehicleMake || 'vehicle'} owner`,
        "24/7 Roadside Assistance included",
        "Award-winning mobile app claims"
      ],
      cta: "Get Free Quote",
      featured: true,
      badge: "SAVE $536/yr",
      pill: null
    },
    {
      name: "Progressive",
      description: "Name your price tool helps you find rates that fit your budget.",
      points: [
        "Wide range of easy-to-use discounts",
        "Snapshot® program rewards safe drivers"
      ],
      cta: "Get Free Quote",
      featured: false,
      topBadge: "Great for your wallet",
      pill: "Save Big with Bundle"
    },
    {
      name: "State Farm",
      description: "Trusted name in auto insurance for over 100 years.",
      points: [
        "Priced as low as $29.99/mo",
        "Includes 24/7 professional agent support"
      ],
      cta: "Get Free Quote",
      featured: false,
      topBadge: "Low Rates 👍",
      pill: "24/7 customer support"
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeIn px-4 pb-20 pt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 leading-tight">
          We found what you're <br className="hidden sm:block" /> looking for
        </h1>
        <p className="text-lg text-gray-600 px-4">
           Explore top offers for your {data.vehicleYear} {data.vehicleMake}
        </p>
      </div>

      <div className="space-y-8">
        {insuranceProviders.map((provider, idx) => (
          <React.Fragment key={idx}>
            {/* Interstitial Text for second item */}
            {idx === 1 && (
              <div className="py-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Still browsing, {data.firstName || 'Driver'}?
                </h3>
                <p className="text-gray-500">Here are a few more great options we know you'll love</p>
              </div>
            )}

            <div className={`bg-white rounded-3xl shadow-lg border overflow-hidden ${provider.featured ? 'border-emerald-700 shadow-xl' : 'border-gray-200'} relative`}>
              
              {/* Featured Header */}
              {provider.featured && (
                <div className="bg-emerald-800 text-white text-center py-2 font-bold uppercase tracking-wider text-sm">
                  Our Featured Card
                </div>
              )}

              {/* Top Badge for non-featured */}
              {provider.topBadge && (
                <div className="absolute top-0 left-0 bg-emerald-400 text-white text-xs font-bold px-4 py-1.5 rounded-br-xl z-10">
                  {provider.topBadge}
                </div>
              )}

              <div className="p-6 sm:p-8">
                {/* Logo Area */}
                <div className="flex justify-center mb-6">
                   <div className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                      {/* Simple Logo Placeholder */}
                      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xl font-serif">
                        {provider.name.charAt(0)}
                      </div>
                      {provider.name}
                   </div>
                </div>

                {/* Description */}
                <h3 className="font-bold text-lg text-gray-900 mb-2">{provider.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {provider.description}
                </p>

                {/* Pill Badge */}
                {provider.pill && (
                  <div className="inline-flex items-center bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                    <span className="mr-1">🏷️</span> {provider.pill}
                  </div>
                )}
                 
                {/* Featured Badge Pill */}
                {provider.badge && (
                  <div className="inline-flex items-center bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                    <span className="mr-1">🏷️</span> {provider.badge}
                  </div>
                )}

                {/* Why is this a fit? (Only featured typically has the header, but we apply list to all) */}
                {provider.featured && (
                   <p className="text-sm font-bold text-gray-900 mb-3">Why is this partner a great fit for you?</p>
                )}

                {/* Bullet Points */}
                <ul className="space-y-3 mb-8">
                  {provider.points.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700 text-sm font-medium">{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-4 rounded-full text-lg shadow-md transition-colors">
                    {provider.cta}
                  </button>
                  <button className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-900 font-bold py-4 rounded-full text-lg flex items-center justify-center gap-2 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                    Call Now
                  </button>
                </div>

                <div className="mt-4 text-center">
                   <button className="text-xs text-gray-500 flex items-center justify-center w-full hover:text-gray-700">
                     Disclaimer 
                     <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                   </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="mt-12 text-center pb-8">
        <h3 className="text-2xl font-bold text-emerald-600 mb-4">Thank you!</h3>
        <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
          You can expect to hear from a representative from <span className="font-bold text-gray-900">BestMoney Partners</span> soon with your free no-obligation quotes.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
           <span className="h-px bg-gray-300 w-16"></span>
           <span>Skip the line, Contact us</span>
           <span className="h-px bg-gray-300 w-16"></span>
        </div>
        <div className="mt-6 flex justify-center gap-6">
             <button className="border border-gray-400 rounded-full px-6 py-2 font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-50">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
               Call Now
             </button>
             <button className="text-emerald-700 font-bold flex items-center gap-1 hover:text-emerald-800">
               Visit Site 
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </button>
        </div>
      </div>
    </div>
  );
};