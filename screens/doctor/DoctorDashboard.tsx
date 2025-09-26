import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { User, Patient, MedicalRecord, Prescription } from '../../types';
import { MOCK_PATIENT_LIST, MOCK_RECORDS } from '../../constants';
import { LockIcon, UploadIcon, PatientIcon, RecordIcon, ChevronDownIcon, DownloadIcon, CloseIcon } from '../../components/icons/IconComponents';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import PatientCard from '../../components/PatientCard';

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    
    const renderContent = () => {
        switch(activeTab) {
            case 'My Patients': return <MyPatientsView user={user} />;
            case 'Dashboard':
            default:
                return <DoctorHome user={user} />;
        }
    };

  return (
    <DashboardLayout user={user} onLogout={onLogout} activeItem={activeTab} onNavItemClick={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

const DoctorHome: React.FC<{ user: User }> = ({ user }) => {
    const myRecords = useMemo(() => MOCK_RECORDS.filter(r => r.practitionerName === user.name), [user.name]);
    const myPatientIds = useMemo(() => [...new Set(myRecords.map(r => r.patientId))], [myRecords]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-heading text-medis-light-text dark:text-medis-dark">Doctor's Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20">
                    <h3 className="font-semibold text-lg text-medis-light-muted dark:text-medis-gray">Total Patients Assigned</h3>
                    <p className="text-3xl font-bold text-medis-primary">{myPatientIds.length}</p>
                </div>
                <div className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20">
                    <h3 className="font-semibold text-lg text-medis-light-muted dark:text-medis-gray">Records You've Added</h3>
                    <p className="text-3xl font-bold text-medis-light-text dark:text-medis-dark">{myRecords.length}</p>
                </div>
                <div className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20">
                    <h3 className="font-semibold text-lg text-medis-light-muted dark:text-medis-gray">Upcoming Appointments</h3>
                    <p className="text-3xl font-bold text-medis-accent">5</p>
                </div>
            </div>
        </div>
    );
}

const MyPatientsView: React.FC<{ user: User }> = ({ user }) => {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const myPatients = useMemo(() => {
        const myRecordPatientIds = new Set(MOCK_RECORDS.filter(r => r.practitionerName === user.name).map(r => r.patientId));
        return MOCK_PATIENT_LIST.filter(p => myRecordPatientIds.has(p.patientId));
    }, [user.name]);
    
    const handleViewRecords = (patient: Patient) => {
        setSelectedPatient(patient);
    };

    if (selectedPatient) {
        return <PatientRecordsDoctorView doctor={user} patient={selectedPatient} onBack={() => setSelectedPatient(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold font-heading text-medis-light-text dark:text-medis-dark">My Patients</h2>
            </div>
            
            {myPatients.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {myPatients.map(patient => (
                        <PatientCard key={patient._id} patient={patient} onViewRecords={handleViewRecords} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-20 bg-medis-light-card dark:bg-medis-secondary rounded-lg border-2 border-dashed border-medis-light-border dark:border-medis-light-gray/20">
                    <PatientIcon className="mx-auto h-12 w-12 text-medis-light-muted dark:text-medis-gray" />
                    <h3 className="mt-2 text-lg font-medium text-medis-light-text dark:text-medis-dark">No patients found</h3>
                    <p className="mt-1 text-sm text-medis-light-muted dark:text-medis-gray">You are not associated with any patient records yet.</p>
                </div>
            )}
        </div>
    );
};

const PatientRecordsDoctorView: React.FC<{ doctor: User; patient: Patient; onBack: () => void; }> = ({ doctor, patient, onBack }) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [patientRecords, setPatientRecords] = useState(() => MOCK_RECORDS.filter(r => r.patientId === patient.patientId));

    const handleAddRecordSuccess = (newRecord: MedicalRecord) => {
        setPatientRecords(prev => [newRecord, ...prev]);
        setIsAddModalOpen(false);
    };

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

    const DetailItem = ({ label, value }: { label: string; value?: string | string[]; }) => (
        <div>
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
                <button 
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-200 dark:bg-medis-light-gray text-medis-light-text dark:text-medis-dark font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-medis-light-gray/70 transition-colors"
                >
                    &larr; Back to My Patients
                </button>
            </div>
            
             <div className="bg-medis-light-card dark:bg-medis-secondary rounded-lg border border-medis-light-border dark:border-medis-light-gray/20">
                <button 
                    onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                    className="w-full flex justify-between items-center p-4"
                >
                    <h3 className="text-lg font-semibold font-heading text-medis-light-text dark:text-medis-dark">Patient Chart Summary</h3>
                    <ChevronDownIcon className={`h-5 w-5 text-medis-light-muted dark:text-medis-gray transition-transform duration-300 ${isDetailsVisible ? 'rotate-180' : ''}`} />
                </button>
                {isDetailsVisible && (
                    <div className="p-6 pt-0 border-t border-medis-light-border dark:border-medis-light-gray/20 space-y-4">
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
                    </div>
                )}
            </div>

            <div className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold font-heading text-medis-light-text dark:text-medis-dark">Patient Records</h3>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-medis-primary text-white font-semibold rounded-md hover:bg-medis-primary-dark transition-colors flex items-center"
                    >
                        <UploadIcon className="h-5 w-5 mr-2" />
                        Add Medical Record
                    </button>
                </div>
                {patientRecords.length > 0 ? (
                    <div className="space-y-4">
                        {patientRecords.map((record: MedicalRecord) => (
                             <button key={record._id} onClick={() => setSelectedRecord(record)} className="w-full text-left flex items-center justify-between p-4 border border-medis-light-border dark:border-medis-light-gray/20 rounded-lg hover:bg-gray-50 dark:hover:bg-medis-light-gray/20 hover:border-medis-primary/50 dark:hover:border-medis-primary/50 transition-all duration-200">
                                <div>
                                    <p className="font-semibold text-medis-light-text dark:text-medis-dark">{record.title}</p>
                                    <div className="flex flex-wrap items-center text-sm text-medis-light-muted dark:text-medis-gray space-x-4">
                                        <span>{record.recordType}</span>
                                        <span>{new Date(record.dateOfService).toLocaleDateString()}</span>
                                        <span>Uploaded by: {record.practitionerName}</span>
                                    </div>
                                </div>
                                {record.attachments?.some(a => a.isEncrypted) && <span title="Encrypted"><LockIcon className="h-5 w-5 text-medis-primary"/></span>}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 dark:bg-medis-secondary-dark/30 rounded-lg">
                        <RecordIcon className="mx-auto h-12 w-12 text-medis-light-muted dark:text-medis-gray" />
                        <h3 className="mt-2 text-lg font-medium text-medis-light-text dark:text-medis-dark">No records found</h3>
                        <p className="mt-1 text-sm text-medis-light-muted dark:text-medis-gray">This patient does not have any medical records yet.</p>
                    </div>
                )}
            </div>
             <Modal isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} title="Medical Record Details">
                {selectedRecord && <RecordDetailView record={selectedRecord} />}
            </Modal>
             <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Medical Record">
                <AddRecordForm doctor={doctor} patient={patient} onSuccess={handleAddRecordSuccess} onClose={() => setIsAddModalOpen(false)} />
            </Modal>
        </div>
    );
};


const AddRecordForm: React.FC<{ doctor: User; patient: Patient; onSuccess: (record: MedicalRecord) => void; onClose: () => void }> = ({ doctor, patient, onSuccess, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const initialFormState = {
        practitionerName: doctor.name,
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
        setFormData(prev => ({ ...prev, symptoms: prev.symptoms.filter((_, i) => i !== index) }));
    };

    const addPrescription = () => {
        setFormData(prev => ({ ...prev, prescriptions: [...prev.prescriptions, { medication: '', dosage: '', duration: '' }] }));
    };

    const removePrescription = (index: number) => {
        setFormData(prev => ({ ...prev, prescriptions: prev.prescriptions.filter((_, i) => i !== index) }));
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
                patientId: patient.patientId,
                recordType: formData.recordType,
                title: `${formData.recordType} for ${patient.firstName}`,
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
                        <label className={labelStyles}>Patient</label>
                        <input type="text" value={`${patient.firstName} ${patient.lastName} (${patient.patientId})`} readOnly className={`${inputStyles} bg-gray-100 dark:bg-medis-secondary-dark/50`} />
                    </div>
                     <div>
                        <label htmlFor="practitionerName" className={labelStyles}>Doctor Name *</label>
                        <input type="text" id="practitionerName" name="practitionerName" value={formData.practitionerName} readOnly className={`${inputStyles} bg-gray-100 dark:bg-medis-secondary-dark/50`} />
                    </div>
                     <div>
                        <label htmlFor="recordType" className={labelStyles}>Record Type *</label>
                        <select id="recordType" name="recordType" value={formData.recordType} onChange={handleInputChange} className={inputStyles} required>
                             <option>Diagnosis</option><option>Consultation</option><option>Prescription</option><option>Lab Report</option><option>Imaging Report</option>
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
                        <input type="text" name="bloodPressure" value={formData.vitalSigns.bloodPressure} onChange={handleVitalSignChange} placeholder="Blood Pressure" className={inputStyles} /><input type="text" name="temperature" value={formData.vitalSigns.temperature} onChange={handleVitalSignChange} placeholder="Temperature" className={inputStyles} /><input type="text" name="heartRate" value={formData.vitalSigns.heartRate} onChange={handleVitalSignChange} placeholder="Heart Rate" className={inputStyles} /><input type="text" name="weight" value={formData.vitalSigns.weight} onChange={handleVitalSignChange} placeholder="Weight" className={inputStyles} />
                    </div>
                </div>

                 <div>
                    <label htmlFor="notes" className={labelStyles}>Additional Notes</label>
                    <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={4} className={inputStyles} placeholder="Enter any additional notes or observations"></textarea>
                </div>
                
                <div className="flex justify-end items-center gap-4 pt-4 border-t border-medis-light-border dark:border-medis-light-gray/20">
                     <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-medis-light-gray text-medis-light-text dark:text-medis-dark font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-medis-light-gray/70 transition-colors">Cancel</button>
                    <button type="submit" disabled={isLoading} className="px-6 py-2 bg-medis-primary text-white font-semibold rounded-md hover:bg-medis-primary-dark transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading && <Spinner className="h-5 w-5 mr-2" />}
                        Create Record
                    </button>
                </div>
            </form>
        </div>
    );
}

const RecordDetailView: React.FC<{ record: MedicalRecord }> = ({ record }) => {
    const DetailItem = ({ label, value }: { label: string, value?: string }) => (
        <div>
            <p className="text-sm font-medium text-medis-light-muted dark:text-medis-gray">{label}</p>
            <p className="text-base text-medis-light-text dark:text-medis-dark">{value || 'N/A'}</p>
        </div>
    );
    
    return (
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            <div>
                <p className="text-sm font-semibold text-medis-primary">{record.recordType}</p>
                <h3 className="text-2xl font-bold font-heading text-medis-light-text dark:text-medis-dark">{record.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-medis-light-border dark:border-medis-light-gray/20 pt-4">
                <DetailItem label="Date of Service" value={new Date(record.dateOfService).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                <DetailItem label="Practitioner" value={record.practitionerName} />
            </div>
            {record.notes && (<div className="border-t border-medis-light-border dark:border-medis-light-gray/20 pt-4"><DetailItem label="Additional Notes" value={record.notes} /></div>)}

            {record.attachments && record.attachments.length > 0 && (
                <div className="border-t border-medis-light-border dark:border-medis-light-gray/20 pt-4">
                    <h4 className="text-sm font-medium text-medis-light-muted dark:text-medis-gray mb-2">Attachments</h4>
                    <ul className="space-y-2">
                        {record.attachments.map((att, index) => (
                            <li key={index} className="flex items-center justify-between bg-medis-light-bg dark:bg-medis-secondary-dark p-2 rounded-md">
                                <div className="flex items-center">
                                    {att.isEncrypted && <LockIcon className="h-4 w-4 text-medis-primary mr-2 flex-shrink-0" />}
                                    <span className="text-sm text-medis-light-text dark:text-medis-dark truncate">{att.fileName}</span>
                                </div>
                                <a href={att.url} download className="ml-4 px-3 py-1 text-xs font-semibold bg-medis-primary/10 text-medis-primary rounded-md hover:bg-medis-primary/20 transition-colors flex items-center">
                                    <DownloadIcon className="h-4 w-4 mr-1.5" />
                                    Download
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}


export default DoctorDashboard;