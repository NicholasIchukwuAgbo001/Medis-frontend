import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { User, AccessLog, Patient, MedicalRecord, Prescription } from '../../types';
import { MOCK_LOGS, MOCK_PATIENT_LIST, MOCK_RECORDS } from '../../constants';
import { LockIcon, UploadIcon, PatientIcon, RecordIcon, ChevronDownIcon, DownloadIcon, SearchIcon, EyeIcon, CloseIcon, SecurityIcon } from '../../components/icons/IconComponents';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import PatientCard from '../../components/PatientCard';
import ThemeToggle from '../../components/ThemeToggle';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [prefilledPatientId, setPrefilledPatientId] = useState<string | undefined>();
    
    const handleNavigateToUpload = (patientId: string) => {
        setPrefilledPatientId(patientId);
        setActiveTab('Medical Records');
    };
    
    const renderContent = () => {
        switch(activeTab) {
            case 'Patients': return <PatientsView onNavigateToUpload={handleNavigateToUpload} />;
            case 'Medical Records': return <MedicalRecordsView prefilledPatientId={prefilledPatientId} />;
            case 'Analytics': return <AnalyticsView />;
            case 'Settings': return <SettingsView user={user} />;
            case 'Dashboard':
            default:
                return <AdminHome />;
        }
    };

  return (
    <DashboardLayout user={user} onLogout={onLogout} activeItem={activeTab} onNavItemClick={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

const AuditLogs: React.FC = () => (
    <div className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20">
        <h3 className="text-xl font-semibold font-heading mb-4 text-medis-light-text dark:text-medis-dark">Recent Activity (Audit Log)</h3>
        <div className="space-y-4">
            {MOCK_LOGS.map(log => (
                <div key={log.id} className="flex items-start">
                    <div className="w-2 h-2 bg-medis-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                        <p className="text-medis-light-text dark:text-medis-dark">{log.details}</p>
                        <p className="text-sm text-medis-light-muted dark:text-medis-gray">By {log.accessorName} ({log.accessorRole}) - {log.timestamp}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const AdminHome: React.FC = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold font-heading text-medis-light-text dark:text-medis-dark">Admin Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5, scale: 1.03 }}
              className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20"
            >
                <h3 className="font-semibold text-lg text-medis-light-muted dark:text-medis-gray">Total Patients</h3>
                <p className="text-3xl font-bold text-medis-primary">{MOCK_PATIENT_LIST.length}</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, scale: 1.03 }}
              className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20"
            >
                <h3 className="font-semibold text-lg text-medis-light-muted dark:text-medis-gray">Records Uploaded Today</h3>
                <p className="text-3xl font-bold text-medis-light-text dark:text-medis-dark">88</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, scale: 1.03 }}
              className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20"
            >
                <h3 className="font-semibold text-lg text-medis-light-muted dark:text-medis-gray">Pending Requests</h3>
                <p className="text-3xl font-bold text-medis-accent">3</p>
            </motion.div>
        </div>
        <AuditLogs />
    </div>
);

const PatientsView: React.FC<{ onNavigateToUpload: (patientId: string) => void }> = ({ onNavigateToUpload }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENT_LIST);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const handleOnboardSuccess = (newPatient: Patient) => {
        setPatients(prev => [newPatient, ...prev]);
        setIsModalOpen(false);
    };

    const handleViewRecords = (patient: Patient) => {
        setSelectedPatient(patient);
    };

    if (selectedPatient) {
        return <PatientRecordsAdminView patient={selectedPatient} onBack={() => setSelectedPatient(null)} onUploadFirstRecord={onNavigateToUpload} />;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold font-heading text-medis-light-text dark:text-medis-dark">Patient Roster</h2>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-medis-primary text-white font-semibold rounded-md hover:bg-medis-primary-dark transition-colors flex items-center"
                >
                    <PatientIcon className="h-5 w-5 mr-2" />
                    Onboard New Patient
                </motion.button>
            </div>
            
            {patients.length > 0 ? (
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {patients.map(patient => (
                        <motion.div key={patient._id} variants={itemVariants}>
                            <PatientCard patient={patient} onViewRecords={handleViewRecords} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                 <div className="text-center py-20 bg-medis-light-card dark:bg-medis-secondary rounded-lg border-2 border-dashed border-medis-light-border dark:border-medis-light-gray/20">
                    <PatientIcon className="mx-auto h-12 w-12 text-medis-light-muted dark:text-medis-gray" />
                    <h3 className="mt-2 text-lg font-medium text-medis-light-text dark:text-medis-dark">No patients found</h3>
                    <p className="mt-1 text-sm text-medis-light-muted dark:text-medis-gray">Get started by onboarding your first patient.</p>
                </div>
            )}


            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Onboard New Patient">
                <OnboardPatientForm onSuccess={handleOnboardSuccess} />
            </Modal>
        </div>
    );
};

const RecordDetailView: React.FC<{ record: MedicalRecord }> = ({ record }) => {
    const patient = MOCK_PATIENT_LIST.find(p => p.patientId === record.patientId);

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="border-t border-medis-light-border dark:border-medis-light-gray/20 pt-4">
            <h4 className="text-base font-semibold text-medis-light-text dark:text-medis-dark mb-3">{title}</h4>
            {children}
        </div>
    );

    const InfoPair = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div>
            <p className="text-sm text-medis-light-muted dark:text-medis-gray">{label}</p>
            <p className="font-medium text-medis-light-text dark:text-medis-dark">{value || 'N/A'}</p>
        </div>
    );

    return (
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <Section title="Record Information">
                    <div className="space-y-3">
                        <InfoPair label="Record ID" value={record._id.toUpperCase()} />
                        <InfoPair label="Patient" value={patient ? `${patient.firstName} ${patient.lastName} (${patient.patientId})` : record.patientId} />
                        <InfoPair label="Doctor" value={record.practitionerName} />
                        <InfoPair label="Record Type" value={record.recordType} />
                        <InfoPair label="Record Date" value={new Date(record.dateOfService).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                    </div>
                </Section>
                {record.vitalSigns && (
                    <Section title="Vital Signs">
                        <div className="space-y-3">
                            <InfoPair label="Blood Pressure" value={record.vitalSigns.bloodPressure} />
                            <InfoPair label="Temperature" value={record.vitalSigns.temperature} />
                            <InfoPair label="Heart Rate" value={record.vitalSigns.heartRate} />
                            <InfoPair label="Weight" value={record.vitalSigns.weight} />
                        </div>
                    </Section>
                )}
            </div>

            {record.diagnosis && (
                <Section title="Diagnosis">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-900 dark:text-blue-100">
                        {record.diagnosis}
                    </div>
                </Section>
            )}

            {record.treatment && (
                <Section title="Treatment">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-900 dark:text-green-100">
                        {record.treatment}
                    </div>
                </Section>
            )}

            {record.symptoms && record.symptoms.length > 0 && (
                <Section title="Symptoms">
                    <div className="flex flex-wrap gap-2">
                        {record.symptoms.map((symptom, i) => (
                            <span key={i} className="px-3 py-1 text-sm bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 rounded-full font-medium">{symptom}</span>
                        ))}
                    </div>
                </Section>
            )}

            {record.prescriptions && record.prescriptions.length > 0 && (
                <Section title="Prescriptions">
                    <div className="flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                    <table className="min-w-full divide-y divide-medis-light-border dark:divide-medis-light-gray/20">
                                        <thead className="bg-medis-light-bg dark:bg-medis-secondary-dark">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-medis-light-text dark:text-medis-dark sm:pl-6">Medication</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-medis-light-text dark:text-medis-dark">Dosage</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-medis-light-text dark:text-medis-dark">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-medis-light-border dark:divide-medis-light-gray/20 bg-medis-light-card dark:bg-medis-secondary">
                                            {record.prescriptions.map((p, i) => (
                                                <tr key={i}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-medis-light-text dark:text-medis-dark sm:pl-6">{p.medication}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medis-light-muted dark:text-medis-gray">{p.dosage}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-medis-light-muted dark:text-medis-gray">{p.duration}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
            )}

            {record.notes && (
                <Section title="Additional Notes">
                    <p className="text-medis-light-muted dark:text-medis-gray italic">{record.notes}</p>
                </Section>
            )}

            {record.blockchainHash && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mt-4 border border-green-200 dark:border-green-800/50">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                             <SecurityIcon className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="ml-3 w-0 flex-1">
                            <h3 className="text-base font-semibold leading-6 text-green-800 dark:text-green-200">Blockchain Verification</h3>
                            <div className="mt-2 text-sm text-green-700 dark:text-green-300 space-y-2">
                                <InfoPair label="Hash" value={<span className="font-mono text-xs break-all">{record.blockchainHash}</span>} />
                                <InfoPair label="Status" value={<span className="font-semibold">Verified</span>} />
                                <InfoPair label="Created" value={new Date(record.createdAt).toLocaleString()} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const PatientRecordsAdminView: React.FC<{ patient: Patient; onBack: () => void; onUploadFirstRecord: (patientId: string) => void; }> = ({ patient, onBack, onUploadFirstRecord }) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
    const patientRecords = MOCK_RECORDS.filter(r => r.patientId === patient.patientId);

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

    const DetailItem = ({ label, value, className = '' }: { label: string; value?: string | string[]; className?: string }) => (
        <div className={className}>
            <p className="text-sm font-medium text-medis-light-muted dark:text-medis-gray">{label}</p>
            {Array.isArray(value) ? (
                 <p className="text-base text-medis-light-text dark:text-medis-dark">{value.join(', ')}</p>
            ) : (
                <p className="text-base text-medis-light-text dark:text-medis-dark">{value || 'N/A'}</p>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-heading text-medis-light-text dark:text-medis-dark">Medical Records for {patient.firstName} {patient.lastName}</h2>
                    <p className="text-sm font-mono text-medis-light-muted dark:text-medis-gray">{patient.patientId}</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-200 dark:bg-medis-light-gray text-medis-light-text dark:text-medis-dark font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-medis-light-gray/70 transition-colors"
                >
                    &larr; Back to Roster
                </motion.button>
            </div>
            
             <div className="bg-medis-light-card dark:bg-medis-secondary rounded-lg border border-medis-light-border dark:border-medis-light-gray/20">
                <button 
                    onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                    className="w-full flex justify-between items-center p-4"
                    aria-expanded={isDetailsVisible}
                    aria-controls="patient-details-summary"
                >
                    <h3 className="text-lg font-semibold font-heading text-medis-light-text dark:text-medis-dark">Patient Chart Summary</h3>
                    <ChevronDownIcon className={`h-5 w-5 text-medis-light-muted dark:text-medis-gray transition-transform duration-300 ${isDetailsVisible ? 'rotate-180' : ''}`} />
                </button>
                {isDetailsVisible && (
                    <div id="patient-details-summary" className="p-6 pt-0 border-t border-medis-light-border dark:border-medis-light-gray/20 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                            <DetailItem label="Full Name" value={`${patient.firstName} ${patient.middleName || ''} ${patient.lastName}`} />
                            <DetailItem label="Date of Birth" value={`${new Date(patient.dateOfBirth).toLocaleDateString()} (${calculateAge(patient.dateOfBirth)} years)`} />
                            <DetailItem label="Gender" value={patient.gender} />
                            <DetailItem label="Phone Number" value={patient.phoneNumber} />
                            <DetailItem label="Email Address" value={patient.email} />
                            <DetailItem label="Address" value={`${patient.address.street}, ${patient.address.city}, ${patient.address.state}`} />
                            <DetailItem label="Emergency Contact" value={`${patient.emergencyContact.name} (${patient.emergencyContact.relationship})`} />
                            <DetailItem label="Emergency Phone" value={patient.emergencyContact.phoneNumber} />
                            <DetailItem label="Blood Type" value={patient.bloodType} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-medis-light-border dark:border-medis-light-gray/20">
                             <DetailItem label="Allergies" value={patient.allergies.length ? patient.allergies : ['N/A']} className="md:col-span-2"/>
                             <DetailItem label="Medical History" value={patient.medicalHistory.length ? patient.medicalHistory : ['N/A']} className="md:col-span-2"/>
                             <DetailItem label="Current Medications" value={patient.currentMedications.length ? patient.currentMedications : ['N/A']} className="md:col-span-2"/>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20">
                <h3 className="text-lg font-semibold font-heading text-medis-light-text dark:text-medis-dark mb-4">Patient Records</h3>
                {patientRecords.length > 0 ? (
                    <div className="space-y-4">
                        {patientRecords.map((record: MedicalRecord) => (
                             <motion.button
                               whileHover={{ scale: 1.01, x: 5 }}
                               key={record._id} onClick={() => setSelectedRecord(record)} className="w-full text-left cursor-pointer flex items-center justify-between p-4 border border-medis-light-border dark:border-medis-light-gray/20 rounded-lg hover:bg-gray-50 dark:hover:bg-medis-light-gray/20 hover:border-medis-primary/50 dark:hover:border-medis-primary/50 transition-all duration-200"
                             >
                                <div>
                                    <p className="font-semibold text-medis-light-text dark:text-medis-dark">{record.title}</p>
                                    <div className="flex flex-wrap items-center text-sm text-medis-light-muted dark:text-medis-gray space-x-4">
                                        <span>{record.recordType}</span>
                                        <span className="hidden sm:inline">|</span>
                                        <span>{new Date(record.dateOfService).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        <span className="hidden sm:inline">|</span>
                                        <span>Uploaded by: {record.practitionerName}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {record.attachments?.some(a => a.isEncrypted) && <span title="Encrypted"><LockIcon className="h-5 w-5 text-medis-primary"/></span>}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 dark:bg-medis-secondary-dark/30 rounded-lg">
                        <RecordIcon className="mx-auto h-12 w-12 text-medis-light-muted dark:text-medis-gray" />
                        <h3 className="mt-2 text-lg font-medium text-medis-light-text dark:text-medis-dark">No records found</h3>
                        <p className="mt-1 text-sm text-medis-light-muted dark:text-medis-gray">This patient does not have any medical records yet.</p>
                        <div className="mt-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onUploadFirstRecord(patient.patientId)}
                                className="px-4 py-2 bg-medis-primary text-white font-semibold rounded-md hover:bg-medis-primary-dark transition-colors flex items-center mx-auto"
                            >
                                <UploadIcon className="h-5 w-5 mr-2" />
                                Upload First Record
                            </motion.button>
                        </div>
                    </div>
                )}
            </div>
             <Modal isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} title="Medical Record Details">
                {selectedRecord && <RecordDetailView record={selectedRecord} />}
            </Modal>
        </div>
    );
};

const initialPatientState: Omit<Patient, '_id' | 'patientId' | 'createdAt' | 'updatedAt' | 'isActive'> = {
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Other',
    phoneNumber: '',
    email: '',
    address: { street: '', city: '', state: '', country: 'Nigeria', postalCode: '' },
    emergencyContact: { name: '', relationship: '', phoneNumber: '' },
    bloodType: '',
    allergies: [],
    medicalHistory: [],
    currentMedications: [],
    insuranceInfo: { provider: '', policyNumber: '', groupNumber: '' },
};

// Moved helper components outside the main component to prevent re-renders on state change
const FormRow = ({ children }: {children: React.ReactNode}) => <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
const FormSection = ({ title, children }: {title: string, children: React.ReactNode}) => (
    <fieldset className="space-y-4 border-t border-medis-light-border dark:border-medis-light-gray/20 pt-4">
        <legend className="text-lg font-semibold font-heading text-medis-light-text dark:text-medis-dark">{title}</legend>
        {children}
    </fieldset>
);

const OnboardPatientForm: React.FC<{onSuccess: (patient: Patient) => void}> = ({onSuccess}) => {
    const [patientId, setPatientId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialPatientState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, group: 'address' | 'emergencyContact' | 'insuranceInfo') => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [group]: {
                ...prev[group],
                [name]: value
            }
        }));
    };
    
    const handleListChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'allergies' | 'medicalHistory' | 'currentMedications') => {
        const { value } = e.target;
        setFormData(prev => ({...prev, [field]: value.split(',').map(item => item.trim())}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        setPatientId('');
        
        console.log('Submitting patient data:', formData);

        setTimeout(() => {
            const newPatientId = 'M-PAT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            const now = new Date().toISOString();
            const newPatient: Patient = {
                ...formData,
                _id: 'p' + Math.random().toString(36).substring(2, 9),
                patientId: newPatientId,
                isActive: true,
                createdAt: now,
                updatedAt: now,
            }
            setPatientId(newPatientId);
            setFormData(initialPatientState);
            setIsLoading(false);
            onSuccess(newPatient);
        }, 2000);
    }
    
    const inputStyles = "w-full p-2 border rounded bg-medis-light-bg dark:bg-medis-secondary-dark border-medis-light-border dark:border-medis-light-gray text-medis-light-text dark:text-medis-dark focus:ring-medis-primary focus:border-medis-primary";

    return (
        <div className="bg-medis-light-card dark:bg-medis-secondary p-8 rounded-lg max-h-[80vh] overflow-y-auto">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <FormSection title="Personal Information">
                    <FormRow>
                        <input name="firstName" value={formData.firstName} onChange={handleInputChange} className={inputStyles} placeholder="First Name" required/>
                        <input name="lastName" value={formData.lastName} onChange={handleInputChange} className={inputStyles} placeholder="Last Name" required/>
                    </FormRow>
                    <FormRow>
                        <input name="middleName" value={formData.middleName || ''} onChange={handleInputChange} className={inputStyles} placeholder="Middle Name (Optional)" />
                        <input name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className={inputStyles} type="date" placeholder="Date of Birth" required/>
                    </FormRow>
                    <FormRow>
                         <select name="gender" value={formData.gender} onChange={handleInputChange} className={inputStyles}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </FormRow>
                </FormSection>

                <FormSection title="Contact Details">
                    <FormRow>
                        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className={inputStyles} type="tel" placeholder="Phone Number" required />
                        <input name="email" value={formData.email} onChange={handleInputChange} className={inputStyles} type="email" placeholder="Email Address" required />
                    </FormRow>
                    <input name="street" value={formData.address?.street} onChange={(e) => handleNestedChange(e, 'address')} className={inputStyles} placeholder="Street Address" />
                    <FormRow>
                        <input name="city" value={formData.address?.city} onChange={(e) => handleNestedChange(e, 'address')} className={inputStyles} placeholder="City" />
                        <input name="state" value={formData.address?.state} onChange={(e) => handleNestedChange(e, 'address')} className={inputStyles} placeholder="State / Province" />
                    </FormRow>
                     <FormRow>
                        <input name="postalCode" value={formData.address?.postalCode} onChange={(e) => handleNestedChange(e, 'address')} className={inputStyles} placeholder="Postal Code" />
                        <input name="country" value={formData.address?.country} onChange={(e) => handleNestedChange(e, 'address')} className={inputStyles} placeholder="Country" />
                    </FormRow>
                </FormSection>
                
                <FormSection title="Medical Profile">
                    <FormRow>
                        <input name="bloodType" value={formData.bloodType} onChange={handleInputChange} className={inputStyles} placeholder="Blood Type (e.g., O+)" />
                    </FormRow>
                    <input value={formData.allergies?.join(', ')} onChange={(e) => handleListChange(e, 'allergies')} className={inputStyles} placeholder="Allergies (comma-separated)" />
                    <input value={formData.medicalHistory?.join(', ')} onChange={(e) => handleListChange(e, 'medicalHistory')} className={inputStyles} placeholder="Medical History (comma-separated)" />
                    <input value={formData.currentMedications?.join(', ')} onChange={(e) => handleListChange(e, 'currentMedications')} className={inputStyles} placeholder="Current Medications (comma-separated)" />
                </FormSection>

                <FormSection title="Emergency Contact">
                    <FormRow>
                        <input name="name" value={formData.emergencyContact?.name} onChange={(e) => handleNestedChange(e, 'emergencyContact')} className={inputStyles} placeholder="Full Name" />
                        <input name="relationship" value={formData.emergencyContact?.relationship} onChange={(e) => handleNestedChange(e, 'emergencyContact')} className={inputStyles} placeholder="Relationship" />
                    </FormRow>
                     <input name="phoneNumber" value={formData.emergencyContact?.phoneNumber} onChange={(e) => handleNestedChange(e, 'emergencyContact')} className={inputStyles} type="tel" placeholder="Phone Number" />
                </FormSection>

                 <FormSection title="Insurance Information">
                    <FormRow>
                        <input name="provider" value={formData.insuranceInfo?.provider} onChange={(e) => handleNestedChange(e, 'insuranceInfo')} className={inputStyles} placeholder="Insurance Provider" />
                        <input name="policyNumber" value={formData.insuranceInfo?.policyNumber} onChange={(e) => handleNestedChange(e, 'insuranceInfo')} className={inputStyles} placeholder="Policy Number" />
                    </FormRow>
                    <input name="groupNumber" value={formData.insuranceInfo?.groupNumber} onChange={(e) => handleNestedChange(e, 'insuranceInfo')} className={inputStyles} placeholder="Group Number" />
                </FormSection>

                <div className="flex justify-end pt-4">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit" 
                        disabled={isLoading}
                        className="px-6 py-3 bg-medis-primary text-white font-semibold rounded-md hover:bg-medis-primary-dark transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Spinner className="h-5 w-5 mr-3" />}
                        Onboard Patient
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

const MedicalRecordsView: React.FC<{ prefilledPatientId?: string }> = ({ prefilledPatientId }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [allRecords, setAllRecords] = useState<MedicalRecord[]>(MOCK_RECORDS);
    const [selectedRecordDetails, setSelectedRecordDetails] = useState<MedicalRecord | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [recordTypeFilter, setRecordTypeFilter] = useState('All Record Types');

    const patientMap = useMemo(() => new Map(MOCK_PATIENT_LIST.map(p => [p.patientId, p])), []);
    
    const recordTypes = useMemo(() => ['All Record Types', ...Array.from(new Set(MOCK_RECORDS.map(r => r.recordType)))], []);

    const filteredRecords = useMemo(() => allRecords.filter(record => {
        const patient = patientMap.get(record.patientId);
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : '';
        const query = searchQuery.toLowerCase();

        const searchMatch = 
            record.patientId.toLowerCase().includes(query) ||
            patientName.toLowerCase().includes(query) ||
            record.practitionerName.toLowerCase().includes(query) ||
            record.title.toLowerCase().includes(query) ||
            (record.diagnosis && record.diagnosis.toLowerCase().includes(query));

        const typeMatch = recordTypeFilter === 'All Record Types' || record.recordType === recordTypeFilter;

        return searchMatch && typeMatch;
    }), [allRecords, searchQuery, recordTypeFilter, patientMap]);

    const handleAddRecordSuccess = (newRecord: MedicalRecord) => {
        setAllRecords(prev => [newRecord, ...prev]);
        setIsAddModalOpen(false);
    };
    
    const inputStyles = "w-full px-3 py-2 bg-medis-light-bg dark:bg-medis-secondary-dark border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm placeholder-medis-light-muted dark:placeholder-medis-gray text-medis-light-text dark:text-medis-dark focus:outline-none focus:ring-medis-primary focus:border-medis-primary sm:text-sm";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold font-heading text-medis-light-text dark:text-medis-dark">Medical Records</h2>
                    <p className="text-medis-light-muted dark:text-medis-gray">Manage patient medical records and blockchain verification</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-medis-primary text-white font-semibold rounded-md hover:bg-medis-primary-dark transition-colors flex items-center"
                >
                    + Add Medical Record
                </motion.button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon className="h-5 w-5 text-medis-light-muted dark:text-medis-gray" />
                    </span>
                    <input type="text" placeholder="Search by patient ID, doctor, or diagnosis..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`${inputStyles} pl-10`} />
                </div>
                <select value={recordTypeFilter} onChange={e => setRecordTypeFilter(e.target.value)} className={`${inputStyles} md:max-w-xs`}>
                    {recordTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>

            <div className="bg-medis-light-card dark:bg-medis-secondary rounded-lg border border-medis-light-border dark:border-medis-light-gray/20">
                <div className="p-4 border-b border-medis-light-border dark:border-medis-light-gray/20">
                    <h3 className="font-semibold text-medis-light-text dark:text-medis-dark">Medical Records ({filteredRecords.length})</h3>
                </div>
                <div className="space-y-2 p-2">
                    {filteredRecords.map(record => {
                        const patient = patientMap.get(record.patientId);
                        const diagnosis = record.diagnosis || record.title;
                        const symptoms = record.symptoms?.join(', ');

                        return (
                            <motion.button
                              whileHover={{ scale: 1.01, zIndex: 1 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                              key={record._id}
                              onClick={() => setSelectedRecordDetails(record)}
                              className="w-full text-left cursor-pointer border border-transparent hover:border-medis-primary/50 dark:hover:border-medis-primary/50 bg-white dark:bg-medis-secondary rounded-lg transition-all duration-200 overflow-hidden"
                            >
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-medis-primary/10 rounded-full">
                                                <RecordIcon className="h-5 w-5 text-medis-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-bold text-lg text-medis-light-text dark:text-white">{patient?.firstName} {patient?.lastName}</h4>
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full">{record.recordType}</span>
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 rounded-full flex items-center gap-1"><LockIcon className="h-3 w-3" /> Verified</span>
                                                </div>
                                                <p className="text-sm text-medis-light-muted dark:text-medis-gray">Patient ID: {record.patientId}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-medis-light-text dark:text-white">{record.practitionerName}</p>
                                            <p className="text-xs text-medis-light-muted dark:text-medis-gray">{new Date(record.dateOfService).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 pl-14">
                                        <p className="text-sm"><span className="font-semibold">Diagnosis:</span> {diagnosis}</p>
                                        {symptoms && <p className="text-sm"><span className="font-semibold">Symptoms:</span> {symptoms}</p>}
                                    </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 flex justify-between items-center">
                                    <p className="text-xs font-mono text-green-800 dark:text-green-300 truncate">
                                        <span className="font-semibold">Blockchain Hash:</span> {record.blockchainHash}
                                    </p>
                                    <EyeIcon className="h-5 w-5 text-medis-primary flex-shrink-0 ml-2"/>
                                </div>
                            </motion.button>
                        )
                    })}
                </div>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Medical Record">
                <AddRecordForm onSuccess={handleAddRecordSuccess} prefilledPatientId={prefilledPatientId} onClose={() => setIsAddModalOpen(false)} />
            </Modal>
             <Modal isOpen={!!selectedRecordDetails} onClose={() => setSelectedRecordDetails(null)} title="Medical Record Details">
                {selectedRecordDetails && <RecordDetailView record={selectedRecordDetails} />}
            </Modal>
        </div>
    );
};

const AddRecordForm: React.FC<{ onSuccess: (record: MedicalRecord) => void, prefilledPatientId?: string, onClose: () => void }> = ({ onSuccess, prefilledPatientId, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const initialFormState = {
        patientId: prefilledPatientId || MOCK_PATIENT_LIST[0]?.patientId || '',
        practitionerName: 'Dr. Evelyn Reed',
        recordType: 'Diagnosis' as MedicalRecord['recordType'],
        dateOfService: new Date().toISOString().slice(0, 16),
        diagnosis: '',
        treatment: '',
        symptoms: [] as string[],
        currentSymptom: '',
        prescriptions: [] as Prescription[],
        vitalSigns: { bloodPressure: '', temperature: '', heartRate: '', weight: '' },
        notes: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleVitalSignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            vitalSigns: { ...prev.vitalSigns, [name]: value }
        }));
    };
    
    const addSymptom = () => {
        if (formData.currentSymptom.trim() && !formData.symptoms.includes(formData.currentSymptom.trim())) {
            setFormData(prev => ({
                ...prev,
                symptoms: [...prev.symptoms, prev.currentSymptom.trim()],
                currentSymptom: ''
            }));
        }
    };

    const removeSymptom = (index: number) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.filter((_, i) => i !== index)
        }));
    };

    const addPrescription = () => {
        setFormData(prev => ({
            ...prev,
            prescriptions: [...prev.prescriptions, { medication: '', dosage: '', duration: '' }]
        }));
    };

    const removePrescription = (index: number) => {
        setFormData(prev => ({
            ...prev,
            prescriptions: prev.prescriptions.filter((_, i) => i !== index)
        }));
    };

    const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        const updatedPrescriptions = [...formData.prescriptions];
        updatedPrescriptions[index] = { ...updatedPrescriptions[index], [name]: value as keyof Prescription };
        setFormData(prev => ({ ...prev, prescriptions: updatedPrescriptions }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);

        setTimeout(() => {
            const newRecord: MedicalRecord = {
                _id: 'rec' + Math.random().toString(36).substring(2, 9),
                patientId: formData.patientId,
                recordType: formData.recordType,
                title: `${formData.recordType} for ${MOCK_PATIENT_LIST.find(p => p.patientId === formData.patientId)?.firstName}`,
                dateOfService: new Date(formData.dateOfService).toISOString(),
                practitionerName: formData.practitionerName,
                facility: { name: 'Medis General Hospital', address: '123 Health St, Medville' },
                diagnosis: formData.diagnosis,
                treatment: formData.treatment,
                symptoms: formData.symptoms,
                prescriptions: formData.prescriptions,
                vitalSigns: formData.vitalSigns,
                notes: formData.notes,
                blockchainHash: '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setIsLoading(false);
            onSuccess(newRecord);
        }, 1500);
    };
    
    const inputStyles = "w-full p-2 border rounded bg-medis-light-bg dark:bg-medis-secondary-dark border-medis-light-border dark:border-medis-light-gray text-medis-light-text dark:text-medis-dark focus:ring-medis-primary focus:border-medis-primary placeholder:text-medis-light-muted/70 dark:placeholder:text-medis-gray/50";
    const labelStyles = "block text-sm font-medium text-medis-light-muted dark:text-medis-gray mb-1";
    
    return (
        <div className="p-6 max-h-[85vh] overflow-y-auto">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="patientId" className={labelStyles}>Patient *</label>
                        <select id="patientId" name="patientId" value={formData.patientId} onChange={handleInputChange} className={inputStyles} required>
                            {MOCK_PATIENT_LIST.map(p => <option key={p._id} value={p.patientId}>{p.firstName} {p.lastName} ({p.patientId})</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="practitionerName" className={labelStyles}>Doctor Name *</label>
                        <input type="text" id="practitionerName" name="practitionerName" value={formData.practitionerName} onChange={handleInputChange} className={inputStyles} placeholder="Enter doctor's name" required />
                    </div>
                     <div>
                        <label htmlFor="recordType" className={labelStyles}>Record Type *</label>
                        <select id="recordType" name="recordType" value={formData.recordType} onChange={handleInputChange} className={inputStyles} required>
                             <option>Diagnosis</option>
                             <option>Consultation</option>
                             <option>Prescription</option>
                             <option>Lab Report</option>
                             <option>Imaging Report</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dateOfService" className={labelStyles}>Record Date *</label>
                        <input type="datetime-local" id="dateOfService" name="dateOfService" value={formData.dateOfService} onChange={handleInputChange} className={inputStyles} required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="diagnosis" className={labelStyles}>Diagnosis</label>
                        <textarea id="diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} rows={3} className={inputStyles} placeholder="Enter diagnosis"></textarea>
                    </div>
                     <div>
                        <label htmlFor="treatment" className={labelStyles}>Treatment</label>
                        <textarea id="treatment" name="treatment" value={formData.treatment} onChange={handleInputChange} rows={3} className={inputStyles} placeholder="Enter treatment plan"></textarea>
                    </div>
                </div>
                
                <div>
                    <label className={labelStyles}>Symptoms</label>
                    <div className="flex items-center gap-2">
                        <input type="text" name="currentSymptom" value={formData.currentSymptom} onChange={handleInputChange} className={inputStyles} placeholder="Enter symptom" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSymptom())}/>
                        <button type="button" onClick={addSymptom} className="px-3 py-2 text-sm font-semibold bg-medis-primary/10 text-medis-primary rounded-md hover:bg-medis-primary/20 transition-colors whitespace-nowrap">+ Add Symptom</button>
                    </div>
                    {formData.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.symptoms.map((symptom, i) => (
                                <span key={i} className="flex items-center gap-2 px-2 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full">
                                    {symptom}
                                    <button type="button" onClick={() => removeSymptom(i)} className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"><CloseIcon className="h-3 w-3"/></button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className={`${labelStyles} mb-0`}>Prescriptions</label>
                         <button type="button" onClick={addPrescription} className="px-3 py-1.5 text-sm font-semibold bg-medis-primary/10 text-medis-primary rounded-md hover:bg-medis-primary/20 transition-colors whitespace-nowrap">+ Add Prescription</button>
                    </div>
                    <div className="space-y-3">
                        {formData.prescriptions.map((p, i) => (
                             <div key={i} className="grid grid-cols-10 gap-2 items-center">
                                <input type="text" name="medication" value={p.medication} onChange={e => handlePrescriptionChange(e, i)} placeholder="Medication Name" className={`${inputStyles} col-span-4`} />
                                <input type="text" name="dosage" value={p.dosage} onChange={e => handlePrescriptionChange(e, i)} placeholder="e.g., 2 tablets" className={`${inputStyles} col-span-2`} />
                                <input type="text" name="duration" value={p.duration} onChange={e => handlePrescriptionChange(e, i)} placeholder="e.g., 7 days" className={`${inputStyles} col-span-3`} />
                                <button type="button" onClick={() => removePrescription(i)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-full flex justify-center col-span-1"><CloseIcon className="h-4 w-4"/></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className={labelStyles}>Vital Signs</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <input type="text" name="bloodPressure" value={formData.vitalSigns.bloodPressure} onChange={handleVitalSignChange} placeholder="Blood Pressure" className={inputStyles} />
                        <input type="text" name="temperature" value={formData.vitalSigns.temperature} onChange={handleVitalSignChange} placeholder="Temperature" className={inputStyles} />
                        <input type="text" name="heartRate" value={formData.vitalSigns.heartRate} onChange={handleVitalSignChange} placeholder="Heart Rate" className={inputStyles} />
                        <input type="text" name="weight" value={formData.vitalSigns.weight} onChange={handleVitalSignChange} placeholder="Weight" className={inputStyles} />
                    </div>
                </div>

                 <div>
                    <label htmlFor="notes" className={labelStyles}>Additional Notes</label>
                    <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={4} className={inputStyles} placeholder="Enter any additional notes or observations"></textarea>
                </div>
                
                <div className="flex justify-end items-center gap-4 pt-4 border-t border-medis-light-border dark:border-medis-light-gray/20">
                     <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-medis-light-gray text-medis-light-text dark:text-medis-dark font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-medis-light-gray/70 transition-colors">
                        Cancel
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-medis-primary text-white font-semibold rounded-md hover:bg-medis-primary-dark transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Spinner className="h-5 w-5 mr-2" />}
                        Create Record
                    </motion.button>
                </div>
            </form>
        </div>
    );
}


const AnalyticsView: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => document.body.classList.contains('dark'));

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.body.classList.contains('dark'));
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const chartTextColor = isDarkMode ? '#EAEAEA' : '#111827';
    const chartGridColor = isDarkMode ? 'rgba(234, 234, 234, 0.1)' : 'rgba(229, 231, 235, 1)';

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const, labels: { color: chartTextColor } },
            title: { display: false },
        },
        scales: {
            x: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } },
            y: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } }
        }
    };

    const lineChartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'New Patients',
            data: [12, 19, 15, 22, 18, 25, 21],
            borderColor: '#007CF0',
            backgroundColor: 'rgba(0, 124, 240, 0.2)',
            tension: 0.3,
            fill: true,
        }],
    };

    const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' as const, labels: { color: chartTextColor, boxWidth: 15, padding: 20 } },
            title: { display: false },
        },
        cutout: '60%',
    };

    const doughnutChartData = {
        labels: ['Lab Report', 'Prescription', 'Diagnosis', 'Consultation', 'Imaging'],
        datasets: [{
            label: '# of Records',
            data: [120, 75, 50, 35, 22],
            backgroundColor: ['#007CF0', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
            borderColor: isDarkMode ? '#1A1A2E' : '#FFFFFF',
            borderWidth: 3,
        }],
    };
    
    const practitioners = useMemo(() => [...new Set(MOCK_RECORDS.map(r => r.practitionerName))], []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-heading text-medis-light-text dark:text-medis-dark">Hospital Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20 lg:col-span-3">
                    <h3 className="font-semibold text-lg text-medis-light-text dark:text-medis-dark mb-4">Patient Onboarding Rate</h3>
                    <div className="h-80 relative">
                        <Line options={lineChartOptions} data={lineChartData} />
                    </div>
                </div>
                <div className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20 lg:col-span-2">
                    <h3 className="font-semibold text-lg text-medis-light-text dark:text-medis-dark mb-4">Record Uploads by Type</h3>
                    <div className="h-80 relative">
                        <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
                    </div>
                </div>
            </div>
             <div className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20">
                <h3 className="font-semibold text-lg text-medis-light-text dark:text-medis-dark mb-4">Active Practitioners</h3>
                 <ul className="divide-y divide-medis-light-border dark:divide-medis-light-gray/20">
                    {practitioners.map(name => {
                        const recordsCount = MOCK_RECORDS.filter(r => r.practitionerName === name).length;
                        return (
                             <li key={name} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-medis-light-text dark:text-medis-dark">{name}</p>
                                    <p className="text-sm text-medis-light-muted dark:text-medis-gray">Specialty: General Medicine</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-medis-primary">{recordsCount}</p>
                                    <p className="text-xs text-medis-light-muted dark:text-medis-gray">records added</p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
};

const SettingsView: React.FC<{ user: User }> = ({ user }) => {
    const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="bg-medis-light-card dark:bg-medis-secondary rounded-lg border border-medis-light-border dark:border-medis-light-gray/20 p-6">
            <h3 className="text-lg font-semibold font-heading text-medis-light-text dark:text-medis-dark mb-4">{title}</h3>
            <div className="space-y-4">{children}</div>
        </div>
    );
    
    const inputStyles = "w-full p-2 border rounded bg-medis-light-bg dark:bg-medis-secondary-dark border-medis-light-border dark:border-medis-light-gray text-medis-light-text dark:text-medis-dark focus:ring-medis-primary focus:border-medis-primary";
    const labelStyles = "block text-sm font-medium text-medis-light-muted dark:text-medis-gray";

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold font-heading text-medis-light-text dark:text-medis-dark">Settings</h2>
            <Card title="Profile Information">
                <div>
                    <label htmlFor="name" className={labelStyles}>Full Name</label>
                    <input type="text" id="name" defaultValue={user.name} className={inputStyles} />
                </div>
                 <div>
                    <label htmlFor="role" className={labelStyles}>Role</label>
                    <input type="text" id="role" defaultValue={user.role} className={`${inputStyles} bg-gray-100 dark:bg-medis-secondary-dark/50`} readOnly />
                </div>
                 <div className="flex justify-end">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-medis-primary text-white font-semibold rounded-md hover:bg-medis-primary-dark transition-colors"
                    >
                        Save Changes
                    </motion.button>
                </div>
            </Card>

            <Card title="Security">
                <div>
                    <label htmlFor="password" className={labelStyles}>Change Password</label>
                    <input type="password" id="password" placeholder="New Password" className={`${inputStyles} mt-1`} />
                    <input type="password" id="confirm-password" placeholder="Confirm New Password" className={`${inputStyles} mt-2`} />
                </div>
                <div className="flex justify-between items-center border-t border-medis-light-border dark:border-medis-light-gray/20 pt-4">
                    <div>
                        <p className="font-medium text-medis-light-text dark:text-medis-dark">Two-Factor Authentication (2FA)</p>
                        <p className="text-sm text-medis-light-muted dark:text-medis-gray">2FA is currently <span className="text-green-500 font-semibold">Enabled</span>.</p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-300 font-semibold rounded-md hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors"
                    >
                        Disable 2FA
                    </motion.button>
                </div>
                 <div className="flex justify-end">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-medis-primary text-white font-semibold rounded-md hover:bg-medis-primary-dark transition-colors"
                    >
                        Update Security Settings
                    </motion.button>
                </div>
            </Card>
            
            <Card title="Interface">
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-medis-light-text dark:text-medis-dark">Theme</p>
                        <p className="text-sm text-medis-light-muted dark:text-medis-gray">Switch between light and dark mode.</p>
                    </div>
                    <ThemeToggle />
                </div>
            </Card>
        </div>
    );
};


export default AdminDashboard;