import React, { useState } from 'react';
import { User } from './types';
import LoginScreen from './screens/LoginScreen';
import AdminDashboard from './screens/admin/AdminDashboard';
import PatientDashboard from './screens/patient/PatientDashboard';
import LandingPage from './screens/LandingPage';
import { UserRole } from './types';
import Modal from './components/Modal';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  }

  const renderContent = () => {
    if (currentUser) {
      switch (currentUser.role) {
        case UserRole.Admin:
          return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
        case UserRole.Patient:
          return <PatientDashboard user={currentUser} onLogout={handleLogout} />;
        default:
          // This case should not be reached
          handleLogout();
          return null;
      }
    }

    return (
      <>
        <LandingPage onLoginClick={openLoginModal} />
        <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
            <LoginScreen onLogin={handleLogin} onClose={closeLoginModal} />
        </Modal>
      </>
    );
  }


  return (
    <div className="min-h-screen font-sans text-medis-light-text dark:text-medis-dark">
      {renderContent()}
    </div>
  );
};

export default App;
