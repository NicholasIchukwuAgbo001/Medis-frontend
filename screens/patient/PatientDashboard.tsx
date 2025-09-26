import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { User, MedicalRecord } from '../../types';
import { MOCK_PATIENT, MOCK_RECORDS, MOCK_PATIENT_LIST } from '../../constants';
import EmergencyNftCard from '../../components/EmergencyNftCard';
import { DownloadIcon, LockIcon, SearchIcon, SecurityIcon } from '../../components/icons/IconComponents';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import ThemeToggle from '../../components/ThemeToggle';
import { motion } from 'framer-motion';

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    
    const renderContent = () => {
        switch(activeTab) {
            case 'My Records': return <MedicalRecordsViewer />;
            case 'Settings': return <SettingsView user={user} />;
            case 'Dashboard':
            default:
                return <PatientHome />;
        }
    };

  return (
    <DashboardLayout user={user} onLogout={onLogout} activeItem={activeTab} onNavItemClick={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

const EmergencyIdSkeleton: React.FC = () => (
    <div className="bg-medis-light-card dark:bg-medis-secondary rounded-xl p-6 border-2 border-medis-light-border dark:border-medis-light-gray/20 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="h-8 w-8 bg-medis-light-border dark:bg-medis-light-gray/50 rounded-md mr-3"></div>
        <div className="h-7 w-2/3 bg-medis-light-border dark:bg-medis-light-gray/50 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <div className="h-4 w-1/4 bg-medis-light-border dark:bg-medis-light-gray/50 rounded"></div>
            <div className="h-6 w-1/2 bg-medis-light-border dark:bg-medis-light-gray/50 rounded"></div>
        </div>
         <div className="space-y-2">
            <div className="h-4 w-1/4 bg-medis-light-border dark:bg-medis-light-gray/50 rounded"></div>
            <div className="h-6 w-3/4 bg-medis-light-border dark:bg-medis-light-gray/50 rounded"></div>
        </div>
         <div className="space-y-2">
            <div className="h-4 w-1/3 bg-medis-light-border dark:bg-medis-light-gray/50 rounded"></div>
            <div className="h-6 w-full bg-medis-light-border dark:bg-medis-light-gray/50 rounded"></div>
        </div>
         <div className="space-y-2">
            <div className="h-4 w-1/3 bg-medis-light-border dark:bg-medis-light-gray/50 rounded"></div>
            <div className="h-6 w-2/3 bg-medis-light-border dark:bg-medis-light-gray/50 rounded"></div>
        </div>
      </div>
    </div>
);


const PatientHome: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-8">
            {isLoading ? <EmergencyIdSkeleton /> : <EmergencyNftCard patient={MOCK_PATIENT} />}
            <div className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20">
                <h3 className="text-xl font-semibold font-heading mb-4 text-medis-light-text dark:text-medis-dark">Real-Time Update Feed</h3>
                <div className="space-y-4">
                    <div className="flex items-start">
                        <div className="w-2 h-2 bg-medis-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                        <div>
                            <p>Dr. Evelyn Reed uploaded a new 'Prescription' record.</p>
                            <p className="text-sm text-medis-light-muted dark:text-medis-gray">2 hours ago</p>
                        </div>
                    </div>
                     <div className="flex items-start">
                        <div className="w-2 h-2 bg-medis-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                        <div>
                            <p>You viewed your 'Surgical History' record.</p>
                            <p className="text-sm text-medis-light-muted dark:text-medis-gray">1 day ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const recordTypes: (MedicalRecord['recordType'] | 'All')[] = ['All', 'Lab Report', 'Prescription', 'Diagnosis', 'Surgical History', 'Consultation', 'Imaging Report'];
type SortOrder = 'date-desc' | 'date-asc' | 'type-asc';

const MedicalRecordsViewer: React.FC = () => {
  const [filter, setFilter] = useState<MedicalRecord['recordType'] | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('date-desc');
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
        setRecords(MOCK_RECORDS);
        setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilter('All');
    setStartDate('');
    setEndDate('');
    setSortOrder('date-desc');
  };

  const filteredRecords = records.filter(record => {
    const typeMatch = filter === 'All' || record.recordType === filter;
    
    const query = searchQuery.toLowerCase();
    const searchMatch = 
        record.title.toLowerCase().includes(query) || 
        record.recordType.toLowerCase().includes(query) ||
        record.dateOfService.toLowerCase().includes(query);

    const recordDate = new Date(record.dateOfService);
    const start = startDate ? new Date(startDate + 'T00:00:00Z') : null;
    const end = endDate ? new Date(endDate + 'T23:59:59Z') : null;
    
    const dateMatch = (!start || recordDate >= start) && (!end || recordDate <= end);

    return typeMatch && searchMatch && dateMatch;
  });
  
  const sortedAndFilteredRecords = [...filteredRecords].sort((a, b) => {
    switch (sortOrder) {
        case 'date-asc':
            return new Date(a.dateOfService).getTime() - new Date(b.dateOfService).getTime();
        case 'type-asc':
            return a.recordType.localeCompare(b.recordType);
        case 'date-desc':
        default:
            return new Date(b.dateOfService).getTime() - new Date(a.dateOfService).getTime();
    }
  });


  const hasActiveFilters = searchQuery !== '' || filter !== 'All' || startDate !== '' || endDate !== '';
  const inputStyles = "w-full px-3 py-2 bg-medis-light-bg dark:bg-medis-secondary-dark border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm text-medis-light-text dark:text-medis-dark focus:outline-none focus:ring-medis-primary focus:border-medis-primary sm:text-sm";

  return (
    <div className="bg-medis-light-card dark:bg-medis-secondary p-6 rounded-lg border border-medis-light-border dark:border-medis-light-gray/20">
        <h3 className="text-xl font-semibold font-heading mb-4 text-medis-light-text dark:text-medis-dark">My Medical Records</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="relative md:col-span-2 lg:col-span-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="h-5 w-5 text-medis-light-muted dark:text-medis-gray" />
                </span>
                <input
                    type="text"
                    placeholder="Search by title, type, or date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-medis-light-bg dark:bg-medis-secondary-dark border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm placeholder-medis-light-muted dark:placeholder-medis-gray text-medis-light-text dark:text-medis-dark focus:outline-none focus:ring-medis-primary focus:border-medis-primary sm:text-sm"
                />
            </div>
            <div>
                 <label htmlFor="start-date" className="sr-only">Start Date</label>
                 <input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputStyles} aria-label="Start date" />
            </div>
            <div>
                 <label htmlFor="end-date" className="sr-only">End Date</label>
                 <input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} className={inputStyles} aria-label="End date" />
            </div>
            <div>
                <label htmlFor="sort-order" className="sr-only">Sort by</label>
                <select id="sort-order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as SortOrder)} className={inputStyles}>
                    <option value="date-desc">Date: Newest First</option>
                    <option value="date-asc">Date: Oldest First</option>
                    <option value="type-asc">Type: A-Z</option>
                </select>
            </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between mb-6 border-b border-medis-light-border dark:border-medis-light-gray/20">
            <div className="flex space-x-2 -mb-px overflow-x-auto">
                {recordTypes.map(type => (
                    <motion.button 
                        whileHover={{ y: -2 }}
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${filter === type ? 'border-b-2 border-medis-primary text-medis-primary' : 'text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white border-b-2 border-transparent'}`}
                    >{type}</motion.button>
                ))}
            </div>
             {hasActiveFilters && (
                <button 
                    onClick={handleClearFilters}
                    className="ml-4 my-1 text-sm text-medis-primary hover:underline whitespace-nowrap"
                >
                    Clear Filters
                </button>
            )}
        </div>

        {isLoading ? (
            <div className="text-center py-20">
                <Spinner className="h-8 w-8 text-medis-primary mx-auto" />
                <p className="mt-4 text-medis-light-muted dark:text-medis-gray">Loading medical records...</p>
            </div>
        ) : (
            <div className="space-y-4">
                {sortedAndFilteredRecords.length > 0 ? (
                    sortedAndFilteredRecords.map((record: MedicalRecord) => (
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
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-medis-light-muted dark:text-medis-gray">No records found matching your filters.</p>
                    </div>
                )}
            </div>
        )}
        
        <Modal isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} title="Medical Record Details">
            {selectedRecord && <RecordDetailView record={selectedRecord} />}
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

const SettingsView: React.FC<{ user: User }> = ({ user }) => {
    const patient = MOCK_PATIENT; // using mock patient for now

    const Card = ({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) => (
        <div className="bg-medis-light-card dark:bg-medis-secondary rounded-lg border border-medis-light-border dark:border-medis-light-gray/20">
            <div className="p-6">
                <h3 className="text-lg font-semibold font-heading text-medis-light-text dark:text-medis-dark mb-4">{title}</h3>
                <div className="space-y-4">{children}</div>
            </div>
            {footer && <div className="bg-medis-light-bg dark:bg-medis-secondary-dark px-6 py-3 border-t border-medis-light-border dark:border-medis-light-gray/20 rounded-b-lg">{footer}</div>}
        </div>
    );
    
    const inputStyles = "w-full p-2 border rounded bg-medis-light-bg dark:bg-medis-secondary-dark border-medis-light-border dark:border-medis-light-gray text-medis-light-text dark:text-medis-dark focus:ring-medis-primary focus:border-medis-primary disabled:opacity-50";
    const labelStyles = "block text-sm font-medium text-medis-light-muted dark:text-medis-gray";
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold font-heading text-medis-light-text dark:text-medis-dark">Settings</h2>
            
            <Card title="Personal Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="name" className={labelStyles}>Full Name</label>
                        <input type="text" id="name" defaultValue={`${patient.firstName} ${patient.lastName}`} className={inputStyles} disabled />
                    </div>
                    <div>
                        <label htmlFor="patientId" className={labelStyles}>Patient ID</label>
                        <input type="text" id="patientId" defaultValue={patient.patientId} className={inputStyles} disabled />
                    </div>
                    <div>
                        <label htmlFor="email" className={labelStyles}>Email Address</label>
                        <input type="email" id="email" defaultValue={patient.email} className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="phone" className={labelStyles}>Phone Number</label>
                        <input type="tel" id="phone" defaultValue={patient.phoneNumber} className={inputStyles} />
                    </div>
                </div>
                 <div className="flex justify-end pt-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-medis-primary text-white font-semibold rounded-md hover:bg-medis-primary-dark transition-colors"
                    >
                        Save Contact Info
                    </motion.button>
                </div>
            </Card>

            <Card 
                title="Login & Security"
                footer={<div className="flex justify-end"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 bg-medis-primary text-white font-semibold rounded-md hover:bg-medis-primary-dark transition-colors">Update Password</motion.button></div>}
            >
                <div>
                    <label htmlFor="password" className={labelStyles}>Change Password</label>
                    <input type="password" id="password" placeholder="New Password" className={`${inputStyles} mt-1`} />
                    <input type="password" id="confirm-password" placeholder="Confirm New Password" className={`${inputStyles} mt-2`} />
                </div>
            </Card>

            <Card title="Notification Preferences">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-medis-light-text dark:text-medis-dark">Email Notifications</p>
                        <p className="text-sm text-medis-light-muted dark:text-medis-gray">Receive updates about your account and new records.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-medis-light-gray rounded-full peer peer-focus:ring-2 peer-focus:ring-medis-primary dark:peer-focus:ring-medis-primary-dark peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-medis-primary"></div>
                    </label>
                </div>
                <div className="flex items-center justify-between border-t border-medis-light-border dark:border-medis-light-gray/20 pt-4">
                    <div>
                        <p className="font-medium text-medis-light-text dark:text-medis-dark">SMS Notifications</p>
                        <p className="text-sm text-medis-light-muted dark:text-medis-gray">Get critical alerts and appointment reminders via text.</p>
                    </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={smsNotifications} onChange={() => setSmsNotifications(!smsNotifications)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-medis-light-gray rounded-full peer peer-focus:ring-2 peer-focus:ring-medis-primary dark:peer-focus:ring-medis-primary-dark peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-medis-primary"></div>
                    </label>
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


export default PatientDashboard;