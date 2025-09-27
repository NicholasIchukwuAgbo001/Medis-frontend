// components/ZkLoginPatientAuth.tsx
import React, { useEffect } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import ZkLoginDisplay from "./ZkLoginDisplay";
import { useZkLogin } from "../hooks/useZkLogin";

interface ZkLoginPatientAuthProps {
  onLogin?: (user: any) => void;
}

const ZkLoginPatientAuth: React.FC<ZkLoginPatientAuthProps> = ({ onLogin }) => {
  const { jwt, startZkLogin } = useZkLogin();

  // Auto-trigger zkLogin when component mounts
  useEffect(() => {
    startZkLogin();
  }, []);

  // Auto-login when zkLogin is successful
  useEffect(() => {
    if (jwt && onLogin) {
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
  }, [jwt, onLogin]);

  return (
    <div className="max-w-md mx-auto bg-medis-light-card dark:bg-medis-secondary rounded-lg shadow-xl overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-medis-light-text dark:text-medis-dark tracking-tight mb-2">
            Patient Portal
          </h1>
          <p className="text-medis-light-muted dark:text-medis-gray">
            Secure healthcare access with zero-knowledge authentication
          </p>
        </div>

        {!jwt ? (
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

            <div className="space-y-4">
              <GoogleLoginButton />

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
          </div>
        ) : (
          <ZkLoginDisplay />
        )}
      </div>
    </div>
  );
};

export default ZkLoginPatientAuth;
