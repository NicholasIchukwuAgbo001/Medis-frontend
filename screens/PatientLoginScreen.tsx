// screens/PatientLoginScreen.tsx
import React, { useState, useEffect } from "react";
import { User } from "../types";
import { LogoIcon, CloseIcon } from "../components/icons/IconComponents";
import Spinner from "../components/Spinner";
import { motion } from "framer-motion";
import GoogleLoginButton from "../components/GoogleLoginButton";
import ZkLoginDisplay from "../components/ZkLoginDisplay";
import { useZkLogin } from "../hooks/useZkLogin";

interface PatientLoginScreenProps {
  onLogin: (user: User) => void;
  onClose: () => void;
}

const PatientLoginScreen: React.FC<PatientLoginScreenProps> = ({
  onLogin,
  onClose,
}) => {
  const { jwt, isLoading, error, startZkLogin } = useZkLogin();
  const [showZkLogin, setShowZkLogin] = useState(false);

  // Auto-trigger zkLogin when component mounts
  useEffect(() => {
    startZkLogin();
  }, []);

  // Auto-login when zkLogin is successful
  useEffect(() => {
    if (jwt && !showZkLogin) {
      // Simulate API call to verify zk proof
      setTimeout(() => {
        // For demo purposes, we'll use a mock patient user
        // In a real app, you would get the user data from your backend after verifying the zk proof
        onLogin({
          id: "PAT001",
          name: "John Doe",
          email: "patient@example.com",
          role: "Patient",
          avatarUrl: "https://example.com/profile.jpg",
        });
      }, 1500);
    }
  }, [jwt, showZkLogin, onLogin]);

  return (
    <div className="w-full max-w-md mx-auto bg-medis-light-card dark:bg-medis-secondary rounded-lg max-h-[90vh] flex flex-col">
      {/* Fixed Close Button */}
      <div className="absolute top-4 right-4 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={onClose}
          className="text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white"
        >
          <CloseIcon className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Scrollable Content with Hidden Scrollbar */}
      <div className="overflow-y-auto p-8 flex-grow hide-scrollbar">
        <div className="text-center mb-8">
          <LogoIcon className="h-12 w-auto text-medis-primary mx-auto" />
          <h1 className="mt-4 text-3xl font-bold font-heading text-medis-light-text dark:text-medis-dark tracking-tight">
            Patient Portal
          </h1>
          <p className="mt-2 text-medis-light-muted dark:text-medis-gray">
            Secure healthcare access with zero-knowledge authentication
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner className="h-12 w-12 text-medis-primary" />
            <p className="mt-4 text-lg text-medis-light-text dark:text-medis-dark">
              Processing authentication...
            </p>
            <p className="mt-2 text-medis-light-muted dark:text-medis-gray">
              Please wait while we verify your identity
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Authentication Error
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : jwt ? (
          <ZkLoginDisplay />
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Zero-knowledge authentication protects your privacy while
                    verifying your identity
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <GoogleLoginButton />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-medis-light-border dark:border-medis-light-gray"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-medis-light-card dark:bg-medis-secondary text-medis-light-muted dark:text-medis-gray">
                  How it works
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-medis-light-bg dark:bg-medis-secondary-dark rounded-lg">
                <div className="text-medis-primary font-bold text-lg">1</div>
                <div className="text-xs text-medis-light-muted dark:text-medis-gray mt-1">
                  OAuth Login
                </div>
              </div>
              <div className="p-3 bg-medis-light-bg dark:bg-medis-secondary-dark rounded-lg">
                <div className="text-medis-primary font-bold text-lg">2</div>
                <div className="text-xs text-medis-light-muted dark:text-medis-gray mt-1">
                  zk Proof
                </div>
              </div>
              <div className="p-3 bg-medis-light-bg dark:bg-medis-secondary-dark rounded-lg">
                <div className="text-medis-primary font-bold text-lg">3</div>
                <div className="text-xs text-medis-light-muted dark:text-medis-gray mt-1">
                  Access Portal
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientLoginScreen;
