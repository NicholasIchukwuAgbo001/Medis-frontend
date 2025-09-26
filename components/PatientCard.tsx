import React from 'react';
import { Patient } from '../types';
import { RecordIcon } from './icons/IconComponents';
import { motion } from 'framer-motion';

interface PatientCardProps {
  patient: Patient;
  onViewRecords: (patient: Patient) => void;
}

const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onViewRecords }) => {
    const age = calculateAge(patient.dateOfBirth);
    const formattedDob = new Date(patient.dateOfBirth).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
    });

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-medis-light-card dark:bg-medis-secondary p-5 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20 shadow-sm flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold font-heading text-medis-light-text dark:text-medis-dark">{`${patient.firstName} ${patient.lastName}`}</h3>
                <p className="text-xs font-mono bg-gray-100 dark:bg-medis-light-gray/30 text-medis-light-muted dark:text-medis-gray px-2 py-1 rounded-full inline-block">{patient.patientId}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${patient.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'}`}>
                {patient.isActive ? 'Active' : 'Inactive'}
            </span>
        </div>
        <div className="mt-4 border-t border-medis-light-border dark:border-medis-light-gray/20 pt-4 space-y-3 text-sm">
            <InfoRow label="Date of Birth" value={`${formattedDob} (${age} years)`} />
            <InfoRow label="Gender" value={patient.gender} />
            <InfoRow label="Phone" value={patient.phoneNumber} />
            <InfoRow label="Email" value={patient.email} />
        </div>
      </div>
      <div className="mt-5 border-t border-medis-light-border dark:border-medis-light-gray/20 pt-4 flex items-center justify-between">
            <p className="text-xs text-medis-light-muted dark:text-medis-gray">Member since {new Date(patient.createdAt).toLocaleDateString()}</p>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewRecords(patient)}
                className="px-3 py-1.5 text-xs font-semibold bg-medis-primary/10 text-medis-primary rounded-md hover:bg-medis-primary/20 transition-colors flex items-center"
            >
                <RecordIcon className="h-4 w-4 mr-1.5" />
                View Records
            </motion.button>
      </div>
    </motion.div>
  );
};

const InfoRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-medis-light-muted dark:text-medis-gray font-medium">{label}:</span>
        <span className="text-medis-light-text dark:text-medis-dark text-right truncate">{value || 'N/A'}</span>
    </div>
)

export default PatientCard;
