export interface LeadData {
  // Vehicle
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleUsage: 'commute' | 'pleasure' | 'business' | '';
  annualMileage: string;

  // Driver
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Non-binary' | '';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed' | '';
  education: 'High School' | 'Associate' | 'Bachelors' | 'Masters' | 'PhD' | '';
  creditScore: 'Excellent' | 'Good' | 'Average' | 'Poor' | '';
  homeownerStatus: 'Own' | 'Rent' | '';
  
  // History
  hasAccidents: boolean | null;
  hasDUI: boolean | null;
  currentlyInsured: boolean | null;
  currentCarrier: string;

  // Contact / Location
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
}

export const INITIAL_DATA: LeadData = {
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleUsage: '',
  annualMileage: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  education: '',
  creditScore: '',
  homeownerStatus: '',
  hasAccidents: null,
  hasDUI: null,
  currentlyInsured: null,
  currentCarrier: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  email: '',
  phone: ''
};

export interface ExtractedData {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
}