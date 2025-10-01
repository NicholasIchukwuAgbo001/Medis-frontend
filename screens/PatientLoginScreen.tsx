// screens/PatientLoginScreen.tsx
import React, { useState } from "react";
import { User, UserRole } from "../types";
import { LogoIcon, CloseIcon } from "../components/icons/IconComponents";
import { motion } from "framer-motion";

interface PatientLoginScreenProps {
  onLogin: (user: User) => void;
  onClose: () => void;
}

const PatientLoginScreen: React.FC<PatientLoginScreenProps> = ({
  onLogin,
  onClose,
}) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [patientId, setPatientId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call
    try {
      // In a real application, you would validate credentials with a backend
      setTimeout(() => {
        onLogin({
          id: patientId || "PAT001",
          name: patientId || "Patient",
          role: UserRole.Patient,
          avatarUrl: "https://example.com/profile.jpg",
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Simulate API call
    try {
      // In a real application, you would register the user with a backend
      setTimeout(() => {
        onLogin({
          id: patientId,
          name: patientId,
          role: UserRole.Patient,
          avatarUrl: "https://example.com/profile.jpg",
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

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
            {isLoginView
              ? "Sign in to your account"
              : "Create a new patient account"}
          </p>
        </div>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
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
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        `
        {isLoginView ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="patientId"
                className="block text-sm font-medium text-medis-light-text dark:text-medis-dark"
              >
                Patient ID
              </label>
              <div className="mt-1">
                <input
                  id="patientId"
                  name="patientId"
                  type="text"
                  required
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm placeholder-medis-light-muted dark:placeholder-medis-gray text-medis-light-text dark:text-medis-dark bg-white dark:bg-medis-secondary focus:outline-none focus:ring-medis-primary focus:border-medis-primary sm:text-sm"
                  placeholder="e.g., PAT-001"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-medis-light-text dark:text-medis-dark"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm placeholder-medis-light-muted dark:placeholder-medis-gray text-medis-light-text dark:text-medis-dark bg-white dark:bg-medis-secondary focus:outline-none focus:ring-medis-primary focus:border-medis-primary sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-medis-primary focus:ring-medis-primary border-medis-light-border dark:border-medis-light-gray rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-medis-light-text dark:text-medis-dark"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-medis-primary hover:text-medis-primary-dark"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medis-primary hover:bg-medis-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medis-primary disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label
                htmlFor="patientId"
                className="block text-sm font-medium text-medis-light-text dark:text-medis-dark"
              >
                Patient ID
              </label>
              <div className="mt-1">
                <input
                  id="patientId"
                  name="patientId"
                  type="text"
                  required
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm placeholder-medis-light-muted dark:placeholder-medis-gray text-medis-light-text dark:text-medis-dark bg-white dark:bg-medis-secondary focus:outline-none focus:ring-medis-primary focus:border-medis-primary sm:text-sm"
                  placeholder="e.g., PAT-001"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-medis-light-text dark:text-medis-dark"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm placeholder-medis-light-muted dark:placeholder-medis-gray text-medis-light-text dark:text-medis-dark bg-white dark:bg-medis-secondary focus:outline-none focus:ring-medis-primary focus:border-medis-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-medis-light-text dark:text-medis-dark"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm placeholder-medis-light-muted dark:placeholder-medis-gray text-medis-light-text dark:text-medis-dark bg-white dark:bg-medis-secondary focus:outline-none focus:ring-medis-primary focus:border-medis-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-medis-light-text dark:text-medis-dark"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm placeholder-medis-light-muted dark:placeholder-medis-gray text-medis-light-text dark:text-medis-dark bg-white dark:bg-medis-secondary focus:outline-none focus:ring-medis-primary focus:border-medis-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medis-primary hover:bg-medis-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medis-primary disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        )}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-medis-light-border dark:border-medis-light-gray"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-medis-light-card dark:bg-medis-secondary text-medis-light-muted dark:text-medis-gray">
                {isLoginView ? "New patient?" : "Already have an account?"}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setIsLoginView(!isLoginView)}
              className="w-full flex justify-center py-2 px-4 border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm text-sm font-medium text-medis-light-text dark:text-medis-dark bg-white dark:bg-medis-secondary hover:bg-medis-light-bg dark:hover:bg-medis-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medis-primary"
            >
              {isLoginView
                ? "Create new account"
                : "Sign in to existing account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLoginScreen;
