import React, { useState } from "react";
import { User } from "./types";
import LoginScreen from "./screens/LoginScreen";
import PatientLoginScreen from "./screens/PatientLoginScreen";
import AdminDashboard from "./screens/admin/AdminDashboard";
import PatientDashboard from "./screens/patient/PatientDashboard";
import LandingPage from "./screens/LandingPage";
import { UserRole } from "./types";
import Modal from "./components/Modal";
import ZkLoginPatientAuth from "./components/ZkLoginPatientAuth";
import { ZkLoginProvider } from "./contexts/ZkLoginContext";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isZkLoginModalOpen, setIsZkLoginModalOpen] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    setIsZkLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openZkLoginModal = () => {
    setIsZkLoginModalOpen(true);
  };

  const closeZkLoginModal = () => {
    setIsZkLoginModalOpen(false);
  };

  const renderContent = () => {
    if (currentUser) {
      switch (currentUser.role) {
        case UserRole.Admin:
          return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
        case UserRole.Patient:
          return (
            <PatientDashboard user={currentUser} onLogout={handleLogout} />
          );
        default:
          // This case should not be reached
          handleLogout();
          return null;
      }
    }

    return (
      <>
        <LandingPage onLoginClick={openLoginModal} onLogin={handleLogin} />
        <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
          <LoginScreen
            onLogin={handleLogin}
            onClose={closeLoginModal}
            onOpenZkLogin={openZkLoginModal}
          />
        </Modal>
        <Modal isOpen={isZkLoginModalOpen} onClose={closeZkLoginModal}>
          <ZkLoginProvider>
            <ZkLoginPatientAuth onLogin={handleLogin} />
          </ZkLoginProvider>
        </Modal>
      </>
    );
  };

  return (
    <div className="min-h-screen font-sans text-medis-light-text dark:text-medis-dark">
      {renderContent()}
    </div>
  );
};

export default App;