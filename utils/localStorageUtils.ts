// utils/localStorageUtils.ts
import { User, Patient, MedicalRecord, AccessLog } from "../types";

// Keys for localStorage
const STORAGE_KEYS = {
  CURRENT_USER: "medis_current_user",
  PATIENT_DATA: "medis_patient_data",
  MEDICAL_RECORDS: "medis_medical_records",
  ACCESS_LOGS: "medis_access_logs",
  USER_PREFERENCES: "medis_user_preferences",
} as const;

// Generic function to save data to localStorage
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error(`Error saving to localStorage for key ${key}:`, error);
  }
};

// Generic function to load data from localStorage
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error(`Error loading from localStorage for key ${key}:`, error);
    return defaultValue;
  }
};

// Clear data from localStorage
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage for key ${key}:`, error);
  }
};

// Clear all medis-related data from localStorage
export const clearAllMedisData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing all medis data from localStorage:", error);
  }
};

// User authentication functions
export const saveCurrentUser = (user: User | null): void => {
  saveToLocalStorage(STORAGE_KEYS.CURRENT_USER, user);
};

export const loadCurrentUser = (): User | null => {
  return loadFromLocalStorage(STORAGE_KEYS.CURRENT_USER, null);
};

export const clearCurrentUser = (): void => {
  removeFromLocalStorage(STORAGE_KEYS.CURRENT_USER);
};

// Patient data functions
export const savePatientData = (patientData: Patient | null): void => {
  saveToLocalStorage(STORAGE_KEYS.PATIENT_DATA, patientData);
};

export const loadPatientData = (): Patient | null => {
  return loadFromLocalStorage(STORAGE_KEYS.PATIENT_DATA, null);
};

export const clearPatientData = (): void => {
  removeFromLocalStorage(STORAGE_KEYS.PATIENT_DATA);
};

// Medical records functions
export const saveMedicalRecords = (records: MedicalRecord[]): void => {
  saveToLocalStorage(STORAGE_KEYS.MEDICAL_RECORDS, records);
};

export const loadMedicalRecords = (): MedicalRecord[] => {
  return loadFromLocalStorage(STORAGE_KEYS.MEDICAL_RECORDS, []);
};

export const clearMedicalRecords = (): void => {
  removeFromLocalStorage(STORAGE_KEYS.MEDICAL_RECORDS);
};

// Access logs functions
export const saveAccessLogs = (logs: AccessLog[]): void => {
  saveToLocalStorage(STORAGE_KEYS.ACCESS_LOGS, logs);
};

export const loadAccessLogs = (): AccessLog[] => {
  return loadFromLocalStorage(STORAGE_KEYS.ACCESS_LOGS, []);
};

export const clearAccessLogs = (): void => {
  removeFromLocalStorage(STORAGE_KEYS.ACCESS_LOGS);
};

// User preferences functions
export const saveUserPreferences = (preferences: any): void => {
  saveToLocalStorage(STORAGE_KEYS.USER_PREFERENCES, preferences);
};

export const loadUserPreferences = (): any => {
  return loadFromLocalStorage(STORAGE_KEYS.USER_PREFERENCES, {});
};

export const clearUserPreferences = (): void => {
  removeFromLocalStorage(STORAGE_KEYS.USER_PREFERENCES);
};

// Initialize localStorage with default values if they don't exist
export const initializeLocalStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    saveCurrentUser(null);
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.PATIENT_DATA)) {
    savePatientData(null);
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.MEDICAL_RECORDS)) {
    saveMedicalRecords([]);
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ACCESS_LOGS)) {
    saveAccessLogs([]);
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)) {
    saveUserPreferences({});
  }
};