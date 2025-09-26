export enum UserRole {
  Admin = 'Hospital Admin',
  Patient = 'Patient',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber: string;
}

export interface PatientEmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export interface Patient {
  _id: string;
  patientId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string; // ISO 8601 date string
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  email: string;
  address: Address;
  emergencyContact: PatientEmergencyContact;
  bloodType: string;
  allergies: string[];
  medicalHistory: string[];
  currentMedications: string[];
  insuranceInfo: InsuranceInfo;
  isActive: boolean;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface Prescription {
  medication: string;
  dosage: string;
  duration: string;
}

export interface VitalSigns {
  bloodPressure: string;
  temperature: string;
  heartRate: string;
  weight: string;
}

export interface MedicalRecord {
  _id: string;
  patientId: string;
  recordType: 'Lab Report' | 'Prescription' | 'Diagnosis' | 'Surgical History' | 'Consultation' | 'Imaging Report';
  title: string;
  dateOfService: string; // ISO 8601 date string
  practitionerName: string;
  facility: {
    name: string;
    address: string;
  };
  notes?: string; // For "Additional Notes"
  diagnosis?: string;
  treatment?: string;
  symptoms?: string[];
  prescriptions?: Prescription[];
  vitalSigns?: VitalSigns;
  attachments?: {
    fileName: string;
    mimeType: string;
    url: string;
    isEncrypted: boolean;
  }[];
  blockchainHash?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface AccessLog {
  id: string;
  timestamp: string;
  accessorName: string;
  accessorRole: UserRole;
  action: 'Viewed' | 'Uploaded' | 'Edited' | 'Revoked Access';
  recordId?: string;
  details: string;
}

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  currentBid: number;
  endTime: string; // ISO 8601 date string
  currency: string;
}
