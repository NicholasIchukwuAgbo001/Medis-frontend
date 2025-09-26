import React from 'react';
import { Patient } from '../types';
import { AlertTriangleIcon } from './icons/IconComponents';

interface EmergencyNftCardProps {
  patient: Patient;
}

const EmergencyNftCard: React.FC<EmergencyNftCardProps> = ({ patient }) => {
  const InfoItem = ({ label, value }: { label: string; value: string | string[] }) => (
    <div>
      <p className="text-sm font-medium text-medis-accent">{label}</p>
      {Array.isArray(value) ? (
        value.map((item, index) => (
            <p key={index} className="text-lg font-semibold text-white">{item}</p>
        ))
      ) : (
        <p className="text-lg font-semibold text-white">{value}</p>
      )}
    </div>
  );

  return (
    <div className="bg-medis-secondary rounded-xl p-6 border-2 border-medis-accent shadow-[0_0_20px_theme(colors.medis-accent/50)]">
      <div className="flex items-center mb-4">
        <AlertTriangleIcon className="h-8 w-8 text-medis-accent mr-3" />
        <h2 className="text-2xl font-bold font-heading text-white">Emergency Medical ID</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem label="Blood Type" value={patient.bloodType} />
        <InfoItem label="Allergies" value={patient.allergies} />
        <InfoItem label="Medical History" value={patient.medicalHistory} />
        <InfoItem label="Emergency Contact" value={`${patient.emergencyContact.name} (${patient.emergencyContact.relationship}) - ${patient.emergencyContact.phoneNumber}`} />
      </div>
    </div>
  );
};

export default EmergencyNftCard;