import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Button } from './components/Button';
import { StepContainer } from './components/StepContainer';
import { AnalyzingStep } from './components/AnalyzingStep';
import { ResultsStep } from './components/ResultsStep';
import { INITIAL_DATA, LeadData } from './types';
import { extractDataFromImage } from './services/geminiService';

// Declaration for Google Maps global
declare global {
  interface Window {
    google: any;
  }
}

enum Step {
  ZIP_LANDING = 0,
  UPLOAD_INTERSTITIAL = 1,
  VEHICLE_YEAR = 2,
  VEHICLE_MAKE = 3,
  VEHICLE_MODEL = 4,
  USAGE = 5,
  ANNUAL_MILEAGE = 6,
  CURRENT_INSURANCE_STATUS = 7,
  CURRENT_CARRIER = 8,
  DRIVER_GENDER = 9,
  DRIVER_MARITAL = 10,
  DRIVER_DOB = 11,
  DRIVER_EDUCATION = 12,
  DRIVER_CREDIT = 13,
  HOMEOWNER_STATUS = 14,
  DRIVER_HISTORY_ACCIDENTS = 15,
  DRIVER_HISTORY_DUI = 16,
  DRIVER_NAME = 17,
  DRIVER_ADDRESS = 18,
  CONTACT_INFO = 19,
  ANALYZING = 20,
  RESULTS = 21
}

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.ZIP_LANDING);
  const [data, setData] = useState<LeadData>(INITIAL_DATA);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [makeSearch, setMakeSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Refs for Google Maps
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef<any>(null);

  const updateData = (updates: Partial<LeadData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const next = () => {
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setStep(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goTo = (s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalSteps = 20;
  const currentProgress = Math.min(100, Math.max(5, (step / totalSteps) * 100));

  // Initialize Google Maps Autocomplete when entering address step
  useEffect(() => {
    if (step === Step.DRIVER_ADDRESS && window.google && window.google.maps && window.google.maps.places && addressInputRef.current) {
      if (!autoCompleteRef.current) {
        autoCompleteRef.current = new window.google.maps.places.Autocomplete(addressInputRef.current, {
          componentRestrictions: { country: "us" },
          fields: ["address_components", "geometry", "formatted_address"],
          types: ["address"],
        });

        autoCompleteRef.current.addListener("place_changed", () => {
          const place = autoCompleteRef.current.getPlace();
          if (!place.address_components) return;

          let streetNumber = "";
          let route = "";
          let city = "";
          let state = "";
          let zip = "";

          place.address_components.forEach((component: any) => {
            const types = component.types;
            if (types.includes("street_number")) {
              streetNumber = component.long_name;
            }
            if (types.includes("route")) {
              route = component.long_name;
            }
            if (types.includes("locality")) {
              city = component.long_name;
            }
            if (types.includes("administrative_area_level_1")) {
              state = component.short_name;
            }
            if (types.includes("postal_code")) {
              zip = component.long_name;
            }
          });

          // Update state with extracted data
          updateData({
            address: `${streetNumber} ${route}`.trim(),
            city: city,
            state: state,
            zipCode: zip || data.zipCode
          });
        });
      }
    }
  }, [step, data.zipCode]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        if (base64String && base64String.includes(',')) {
          const base64Content = base64String.split(',')[1];
          
          try {
            const extracted = await extractDataFromImage(base64Content, file.type);
            
            updateData({
              firstName: extracted.firstName || data.firstName,
              lastName: extracted.lastName || data.lastName,
              address: extracted.address || data.address,
              city: extracted.city || data.city,
              state: extracted.state || data.state,
              zipCode: extracted.zipCode || data.zipCode,
              dateOfBirth: extracted.dateOfBirth || data.dateOfBirth,
              vehicleYear: extracted.vehicleYear || data.vehicleYear,
              vehicleMake: extracted.vehicleMake || data.vehicleMake,
              vehicleModel: extracted.vehicleModel || data.vehicleModel,
            });
            goTo(Step.VEHICLE_YEAR);
          } catch (err) {
            console.error(err);
            setUploadError("We couldn't read that image clearly. Please try again or continue manually.");
          } finally {
            setIsUploading(false);
          }
        } else {
            setUploadError("Invalid file format.");
            setIsUploading(false);
        }
      };
      reader.onerror = () => {
          setUploadError("Error reading file.");
          setIsUploading(false);
      }
      reader.readAsDataURL(file);
    } catch (e) {
      setUploadError("Error processing upload.");
      setIsUploading(false);
    }
  };

  // --- ICONS ---
  const Icons = {
    Car: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002.5 12a6 6 0 006 6h2m5.5 0h.5M9 18a2 2 0 110-4 2 2 0 010 4zm9 0a2 2 0 110-4 2 2 0 010 4z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Commute: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14M8 21V12a2 2 0 012-2h4a2 2 0 012 2v9" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Pleasure: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M10 9l5 3-5 3V9z" fill="currentColor" opacity="0.1"/></svg>,
    Business: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
    Male: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21v-2a4 4 0 014-4h5a4 4 0 014 4v2"/></svg>,
    Female: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21a9 9 0 100-18 9 9 0 000 18z"/><path d="M12 7v4"/><path d="M10 9h4"/></svg>,
    Home: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Rent: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    Upload: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    Manual: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    Check: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    Cross: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  };

  // Helper render functions
  const renderZipLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center bg-white">
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-none">
          Cheap Car Insurance <br className="hidden sm:block" />
          <span className="text-emerald-500">Rates Are Here.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Compare quotes from top providers in 2 minutes. Drivers save an average of <span className="font-bold text-gray-900">$536/year</span>.
        </p>
        
        <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-2xl border border-gray-100">
           <label className="block text-left text-sm font-bold text-gray-700 mb-2 ml-1">Enter Zip Code</label>
           <div className="flex gap-2">
             <input
                type="text"
                pattern="[0-9]*"
                maxLength={5}
                className="block w-full text-center text-2xl font-bold tracking-widest px-4 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all placeholder-gray-300"
                placeholder="ZIP"
                value={data.zipCode}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    updateData({ zipCode: val });
                }}
              />
              <button 
                onClick={() => {
                    if (data.zipCode.length === 5) next();
                }}
                disabled={data.zipCode.length < 5}
                className="bg-emerald-500 text-white rounded-xl px-6 font-bold text-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                GO
              </button>
           </div>
           <p className="text-xs text-gray-400 mt-4 text-center flex items-center justify-center gap-1">
             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
             Free to use, no credit card required
           </p>
        </div>
      </div>
    </div>
  );

  const renderUploadInterstitial = () => (
    <StepContainer 
      title="Speed up your quote?" 
      subtitle="We can auto-fill your info from a photo."
      onBack={back}
    >
      <div className="flex flex-col gap-2">
        <Button 
            variant="list-item" 
            onClick={() => fileInputRef.current?.click()}
            icon={Icons.Upload}
            subtitle="Recommended"
            isLoading={isUploading}
        >
          {isUploading ? "Scanning..." : "Auto-Fill with AI"}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />
        </Button>

        <Button 
            variant="list-item" 
            onClick={next}
            icon={Icons.Manual}
            subtitle="Takes about 2 mins"
            disabled={isUploading}
        >
            Continue Manually
        </Button>
      </div>
      {uploadError && <p className="text-red-500 text-sm text-center mt-4">{uploadError}</p>}
    </StepContainer>
  );

  const renderVehicleYear = () => {
    const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());
    return (
      <StepContainer title="Vehicle Year" onBack={back}>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {years.map(year => (
            <button 
              key={year} 
              onClick={() => { updateData({ vehicleYear: year }); next(); }}
              className={`py-4 rounded-xl border text-lg font-bold transition-all ${
                  data.vehicleYear === year 
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400 hover:shadow-md'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </StepContainer>
    );
  };

  const renderVehicleMake = () => {
    const makes = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Jeep", "Hyundai", "Kia", "BMW", "Mercedes", "Subaru", "Volkswagen", "Mazda", "Lexus", "Tesla", "Dodge"];
    const filteredMakes = makes.filter(make => 
        make.toLowerCase().includes(makeSearch.toLowerCase())
    );

    return (
      <StepContainer title="Vehicle Make" onBack={back}>
        <div className="mb-6 relative">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
             <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-lg transition-all"
                placeholder="Search Make (e.g. Toyota)"
                value={makeSearch}
                onChange={(e) => setMakeSearch(e.target.value)}
            />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
           {filteredMakes.map(make => (
            <Button 
              key={make} 
              variant="outline"
              onClick={() => { updateData({ vehicleMake: make }); next(); }}
              className={`py-4 text-lg ${data.vehicleMake === make ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : ''}`}
            >
              {make}
            </Button>
          ))}
           <Button variant="outline" onClick={() => { updateData({ vehicleMake: 'Other' }); next(); }}>Other</Button>
        </div>
      </StepContainer>
    );
  };

  const renderVehicleModel = () => (
    <StepContainer title="Vehicle Model" onBack={back}>
      <div className="space-y-6">
        <div className="relative">
             <input
                type="text"
                className="block w-full px-6 py-5 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xl transition-all font-semibold"
                placeholder="e.g. Camry, Civic, F-150"
                value={data.vehicleModel}
                onChange={(e) => updateData({ vehicleModel: e.target.value })}
                autoFocus
            />
        </div>
        <Button 
            fullWidth 
            disabled={!data.vehicleModel}
            onClick={next}
        >
            Continue
        </Button>
      </div>
    </StepContainer>
  );

  const renderUsage = () => (
    <StepContainer title="Primary Vehicle Use" onBack={back}>
      <div className="flex flex-col gap-2">
        {[
            { label: 'Commute', icon: Icons.Commute, sub: 'Daily driving to work/school' }, 
            { label: 'Pleasure', icon: Icons.Pleasure, sub: 'Errands and weekends' }, 
            { label: 'Business', icon: Icons.Business, sub: 'Sales calls, rideshare, etc.' }
        ].map((opt) => (
            <Button
                key={opt.label}
                variant="list-item"
                selected={data.vehicleUsage === opt.label.toLowerCase()}
                onClick={() => { updateData({ vehicleUsage: opt.label.toLowerCase() as any }); next(); }}
                icon={opt.icon}
                subtitle={opt.sub}
            >
                {opt.label}
            </Button>
        ))}
      </div>
    </StepContainer>
  );

  const renderAnnualMileage = () => (
    <StepContainer title="Annual Mileage" onBack={back}>
        <div className="flex flex-col gap-2">
            {[
                { label: '< 5,000', sub: 'Low mileage' },
                { label: '5,000 - 10,000', sub: 'Average' },
                { label: '10,000 - 15,000', sub: 'Above Average' },
                { label: '15,000+', sub: 'High mileage' }
            ].map(m => (
                <Button 
                    key={m.label} 
                    variant="list-item"
                    onClick={() => { updateData({ annualMileage: m.label }); next(); }}
                    subtitle={m.sub}
                    icon={Icons.Car}
                >
                    {m.label}
                </Button>
            ))}
        </div>
    </StepContainer>
  );

  const renderCurrentInsuranceStatus = () => (
      <StepContainer title="Are you currently insured?" onBack={back}>
          <div className="flex flex-col gap-2">
              <Button variant="list-item" onClick={() => { updateData({ currentlyInsured: true }); next(); }} icon={Icons.Check}>
                  Yes, I am insured
              </Button>
              <Button variant="list-item" onClick={() => { updateData({ currentlyInsured: false }); goTo(Step.DRIVER_GENDER); }} icon={Icons.Cross}>
                  No, I am not insured
              </Button>
          </div>
      </StepContainer>
  );

  const renderCurrentCarrier = () => {
      const carriers = ["State Farm", "Geico", "Progressive", "Allstate", "Liberty Mutual", "AAA", "Farmers", "Nationwide", "Other"];
      return (
        <StepContainer title="Current Carrier" onBack={back}>
            <div className="grid grid-cols-2 gap-3">
                {carriers.map(c => (
                    <Button 
                        key={c} 
                        variant="outline" 
                        onClick={() => { updateData({ currentCarrier: c }); next(); }}
                        className={`h-20 ${data.currentCarrier === c ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''}`}
                    >
                        {c}
                    </Button>
                ))}
            </div>
        </StepContainer>
      );
  };

  const renderGender = () => (
      <StepContainer title="Driver Gender" onBack={back}>
          <div className="flex flex-col gap-2">
              <Button variant="list-item" onClick={() => { updateData({ gender: 'Male' }); next(); }} icon={Icons.Male}>
                  Male
              </Button>
              <Button variant="list-item" onClick={() => { updateData({ gender: 'Female' }); next(); }} icon={Icons.Female}>
                  Female
              </Button>
              <Button variant="list-item" onClick={() => { updateData({ gender: 'Non-binary' }); next(); }} icon={Icons.Check}>
                  Non-binary
              </Button>
          </div>
      </StepContainer>
  );

  const renderMarital = () => (
    <StepContainer title="Marital Status" onBack={back}>
        <div className="flex flex-col gap-2">
            {['Single', 'Married', 'Divorced', 'Widowed'].map(s => (
                <Button key={s} variant="list-item" onClick={() => { updateData({ maritalStatus: s as any }); next(); }} icon={Icons.Check}>
                    {s}
                </Button>
            ))}
        </div>
    </StepContainer>
  );

  const renderDOB = () => (
    <StepContainer title="Date of Birth" onBack={back}>
        <div className="max-w-xs mx-auto">
            <input 
                type="date"
                className="block w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xl text-center font-bold"
                value={data.dateOfBirth}
                onChange={(e) => updateData({ dateOfBirth: e.target.value })}
            />
            <Button fullWidth onClick={next} disabled={!data.dateOfBirth} className="mt-8">Continue</Button>
        </div>
    </StepContainer>
  );

  const renderEducation = () => (
    <StepContainer title="Highest Education" onBack={back}>
        <div className="flex flex-col gap-2">
            {['High School', 'Associate', 'Bachelors', 'Masters', 'PhD'].map(e => (
                 <Button key={e} variant="list-item" onClick={() => { updateData({ education: e as any }); next(); }} icon={Icons.Check}>
                    {e}
                 </Button>
            ))}
        </div>
    </StepContainer>
  );

  const renderCredit = () => (
      <StepContainer title="Credit Score Estimate" subtitle="This helps find accurate discounts." onBack={back}>
          <div className="flex flex-col gap-2">
              {[
                  { l: 'Excellent', d: '720+' },
                  { l: 'Good', d: '680-719' },
                  { l: 'Average', d: '580-679' },
                  { l: 'Poor', d: '< 580' }
              ].map(c => (
                  <Button 
                    key={c.l} 
                    variant="list-item" 
                    onClick={() => { updateData({ creditScore: c.l as any }); next(); }}
                    subtitle={`Score: ${c.d}`}
                    icon={Icons.Check}
                >
                    {c.l}
                </Button>
              ))}
          </div>
      </StepContainer>
  );

  const renderHomeowner = () => (
    <StepContainer title="Do you own your home?" onBack={back}>
        <div className="flex flex-col gap-2">
            <Button variant="list-item" onClick={() => { updateData({ homeownerStatus: 'Own' }); next(); }} icon={Icons.Home}>
                Own
            </Button>
            <Button variant="list-item" onClick={() => { updateData({ homeownerStatus: 'Rent' }); next(); }} icon={Icons.Rent}>
                Rent
            </Button>
        </div>
    </StepContainer>
  );

  const renderHistory = (type: 'Accidents' | 'DUI', field: keyof LeadData, title: string) => (
      <StepContainer title={title} onBack={back}>
          <div className="flex flex-col gap-2">
              <Button variant="list-item" onClick={() => { updateData({ [field]: true }); next(); }} icon={Icons.Check}>
                  Yes
              </Button>
              <Button variant="list-item" onClick={() => { updateData({ [field]: false }); next(); }} icon={Icons.Cross}>
                  No
              </Button>
          </div>
      </StepContainer>
  );

  const renderName = () => (
      <StepContainer title="Who are these quotes for?" onBack={back}>
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">First Name</label>
                  <input
                    type="text"
                    className="block w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-lg transition-all"
                    value={data.firstName}
                    placeholder="John"
                    onChange={(e) => updateData({ firstName: e.target.value })}
                  />
              </div>
              <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Last Name</label>
                  <input
                    type="text"
                    className="block w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-lg transition-all"
                    value={data.lastName}
                    placeholder="Doe"
                    onChange={(e) => updateData({ lastName: e.target.value })}
                  />
              </div>
              <Button fullWidth onClick={next} disabled={!data.firstName || !data.lastName} className="mt-4">Next</Button>
          </div>
      </StepContainer>
  );

  const renderAddress = () => (
    <StepContainer title="Confirm Address" onBack={back}>
        <div className="space-y-4">
            <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Street Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <input
                      ref={addressInputRef}
                      type="text"
                      placeholder="Start typing your address..."
                      className="block w-full pl-11 pr-6 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-lg"
                      value={data.address}
                      onChange={(e) => updateData({ address: e.target.value })}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 ml-1">
                  Powered by Google Maps
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">City</label>
                    <input
                        type="text"
                        placeholder="City"
                        className="block w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-lg bg-gray-50"
                        value={data.city}
                        onChange={(e) => updateData({ city: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">State</label>
                     <input
                        type="text"
                        placeholder="State"
                        className="block w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-lg bg-gray-50"
                        value={data.state}
                        onChange={(e) => updateData({ state: e.target.value })}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1">
               <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Zip Code</label>
                     <input
                        type="text"
                        placeholder="Zip"
                        className="block w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-lg bg-gray-50"
                        value={data.zipCode}
                        onChange={(e) => updateData({ zipCode: e.target.value })}
                    />
                </div>
            </div>
            <Button fullWidth onClick={next} disabled={!data.address || !data.city} className="mt-4">Next</Button>
        </div>
    </StepContainer>
  );

  const renderContact = () => (
      <StepContainer title="Where should we send your quotes?" onBack={back}>
           <div className="space-y-5">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                <input
                    type="email"
                    placeholder="name@example.com"
                    className="block w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-lg"
                    value={data.email}
                    onChange={(e) => updateData({ email: e.target.value })}
                />
            </div>
            <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Phone Number</label>
                <input
                    type="tel"
                    placeholder="(555) 555-5555"
                    className="block w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-lg"
                    value={data.phone}
                    onChange={(e) => updateData({ phone: e.target.value })}
                />
            </div>
            
             <Button 
                fullWidth 
                variant="primary"
                className="text-xl font-bold shadow-xl py-5 mt-4"
                onClick={() => setStep(Step.ANALYZING)} 
                disabled={!data.email || !data.phone}
            >
                View My Quotes &rarr;
            </Button>
            
            <p className="text-xs text-gray-400 text-center leading-relaxed mt-4">
                By clicking "View My Quotes", you verify that the information you provided is correct.
            </p>
           </div>
      </StepContainer>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <Header progress={currentProgress} />
      
      <main className="flex-grow pt-8 sm:pt-12">
        {step === Step.ZIP_LANDING && renderZipLanding()}
        {step === Step.UPLOAD_INTERSTITIAL && renderUploadInterstitial()}
        {step === Step.VEHICLE_YEAR && renderVehicleYear()}
        {step === Step.VEHICLE_MAKE && renderVehicleMake()}
        {step === Step.VEHICLE_MODEL && renderVehicleModel()}
        {step === Step.USAGE && renderUsage()}
        {step === Step.ANNUAL_MILEAGE && renderAnnualMileage()}
        {step === Step.CURRENT_INSURANCE_STATUS && renderCurrentInsuranceStatus()}
        {step === Step.CURRENT_CARRIER && renderCurrentCarrier()}
        {step === Step.DRIVER_GENDER && renderGender()}
        {step === Step.DRIVER_MARITAL && renderMarital()}
        {step === Step.DRIVER_DOB && renderDOB()}
        {step === Step.DRIVER_EDUCATION && renderEducation()}
        {step === Step.DRIVER_CREDIT && renderCredit()}
        {step === Step.HOMEOWNER_STATUS && renderHomeowner()}
        {step === Step.DRIVER_HISTORY_ACCIDENTS && renderHistory('Accidents', 'hasAccidents', 'Any accidents in last 3 years?')}
        {step === Step.DRIVER_HISTORY_DUI && renderHistory('DUI', 'hasDUI', 'Any DUIs in last 3 years?')}
        {step === Step.DRIVER_NAME && renderName()}
        {step === Step.DRIVER_ADDRESS && renderAddress()}
        {step === Step.CONTACT_INFO && renderContact()}
        
        {step === Step.ANALYZING && (
          <AnalyzingStep 
            vehicleYear={data.vehicleYear} 
            vehicleMake={data.vehicleMake} 
            onComplete={() => setStep(Step.RESULTS)} 
          />
        )}
        
        {step === Step.RESULTS && <ResultsStep data={data} />}
      </main>

      <Footer />
    </div>
  );
};

export default App;