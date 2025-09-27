import React, { useState } from "react";
import { User, UserRole } from "../types";
import { MOCK_USERS } from "../constants";
import { LogoIcon, CloseIcon } from "../components/icons/IconComponents";
import Spinner from "../components/Spinner";
import { motion } from "framer-motion";

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onClose: () => void;
  onOpenZkLogin?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onClose,
  onOpenZkLogin,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.Admin);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin(MOCK_USERS[selectedRole]);
      setIsLoading(false);
    }, 1500);
  };

  const RoleTab = ({ role, label }: { role: UserRole; label: string }) => (
    <motion.button
      type="button"
      onClick={() => setSelectedRole(role)}
      whileHover={{
        backgroundColor:
          selectedRole !== role
            ? document.body.classList.contains("dark")
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.03)"
            : undefined,
      }}
      className={`w-full py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-medis-primary rounded-t-md
        ${
          selectedRole === role
            ? "border-b-2 border-medis-primary text-medis-primary"
            : "border-b-2 border-medis-light-border dark:border-medis-light-gray/20 text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white"
        }`}
    >
      {label}
    </motion.button>
  );

  const isLogin = authMode === "login";
  const inputStyles =
    "mt-1 block w-full px-3 py-2 bg-medis-light-bg dark:bg-medis-secondary-dark border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm placeholder-medis-light-muted dark:placeholder-medis-gray text-medis-light-text dark:text-medis-dark focus:outline-none focus:ring-medis-primary focus:border-medis-primary sm:text-sm";

  return (
    <div className="w-full max-w-lg mx-auto bg-medis-light-card dark:bg-medis-secondary rounded-lg max-h-[90vh] flex flex-col">
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
        <div className="text-center mb-6">
          <LogoIcon className="h-12 w-auto text-medis-primary mx-auto" />
          <h1 className="mt-4 text-3xl font-bold font-heading text-medis-light-text dark:text-medis-dark tracking-tight">
            {isLogin ? "Welcome back" : "Create an Account"}
          </h1>
          <p className="mt-2 text-medis-light-muted dark:text-medis-gray">
            {isLogin
              ? "Securely access your health portal."
              : "Join Medis to take control of your health data."}
          </p>
        </div>

        <div className="grid grid-cols-2 mb-6">
          <RoleTab role={UserRole.Admin} label="Hospital Admin" />
          <RoleTab role={UserRole.Patient} label="Patient" />
        </div>

        {selectedRole === UserRole.Patient && (
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-medis-light-border dark:border-medis-light-gray"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-medis-light-card dark:bg-medis-secondary text-medis-light-muted dark:text-medis-gray">
                  Patient Authentication Options
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Set auth mode to login and show patient ID field
                  setAuthMode("login");
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm text-sm font-medium text-medis-light-text dark:text-medis-dark bg-white dark:bg-medis-secondary hover:bg-gray-50 dark:hover:bg-medis-light-gray/20 transition-colors"
              >
                <svg
                  className="mr-2 h-5 w-5 text-medis-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                Traditional Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Close this modal and open the zkLogin modal
                  onClose();
                  // Trigger the zkLogin modal from the parent if the prop exists
                  if (onOpenZkLogin) {
                    onOpenZkLogin();
                  }
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm text-sm font-medium text-white bg-medis-primary hover:bg-medis-primary-dark transition-colors"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
                Zero-Knowledge Login
              </motion.button>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAuthAction();
          }}
        >
          <div className="space-y-4">
            {isLogin ? (
              // LOGIN MODE
              <>
                {selectedRole === UserRole.Patient ? (
                  // PATIENT AUTHENTICATION OPTIONS
                  <div className="py-6">
                    <h3 className="text-lg font-medium text-medis-light-text dark:text-medis-dark mb-4 text-center">
                      Patient Authentication
                    </h3>
                    <p className="text-medis-light-muted dark:text-medis-gray text-center mb-6">
                      Securely access your health portal with zero-knowledge
                      authentication
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
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
                            Zero-knowledge authentication protects your privacy
                            while verifying your identity
                          </p>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Close this modal and open the zkLogin modal
                        onClose();
                        // Trigger the zkLogin modal from the parent if the prop exists
                        if (onOpenZkLogin) {
                          onOpenZkLogin();
                        }
                      }}
                      className="w-full flex items-center justify-center px-4 py-3 border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm text-base font-medium text-white bg-medis-primary hover:bg-medis-primary-dark transition-colors"
                    >
                      <svg
                        className="mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                      </svg>
                      Login with Zero-Knowledge Authentication
                    </motion.button>

                    <div className="mt-6 text-center">
                      <p className="text-xs text-medis-light-muted dark:text-medis-gray">
                        By proceeding, you agree to our Privacy Policy and Terms
                        of Service
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="hospital-id"
                      className="block text-sm font-medium text-medis-light-muted dark:text-medis-gray"
                    >
                      Hospital ID
                    </label>
                    <input
                      type="text"
                      id="hospital-id"
                      placeholder="e.g., HSP-001"
                      required
                      className={inputStyles}
                    />
                  </div>
                )}
              </>
            ) : (
              // REGISTER MODE
              <>
                {selectedRole === UserRole.Patient ? (
                  // PATIENT REGISTRATION NOT ALLOWED WITH MANUAL METHOD
                  <div className="py-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-medis-primary/10">
                      <svg
                        className="h-6 w-6 text-medis-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-medis-light-text dark:text-medis-dark">
                      Patient Registration
                    </h3>
                    <p className="mt-2 text-medis-light-muted dark:text-medis-gray">
                      Patient registration is only available through
                      zero-knowledge authentication.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Close this modal and open the zkLogin modal
                        onClose();
                        // Trigger the zkLogin modal from the parent if the prop exists
                        if (onOpenZkLogin) {
                          onOpenZkLogin();
                        }
                      }}
                      className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medis-primary hover:bg-medis-primary-dark transition-colors"
                    >
                      <svg
                        className="mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                      </svg>
                      Register with Zero-Knowledge Authentication
                    </motion.button>
                  </div>
                ) : (
                  // HOSPITAL ADMIN REGISTER FORM
                  <>
                    <div>
                      <label
                        htmlFor="hospital-name"
                        className="block text-sm font-medium text-medis-light-muted dark:text-medis-gray"
                      >
                        Hospital Name
                      </label>
                      <input
                        type="text"
                        id="hospital-name"
                        placeholder="e.g. Medis General Hospital"
                        required
                        className={inputStyles}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="license-no"
                        className="block text-sm font-medium text-medis-light-muted dark:text-medis-gray"
                      >
                        License/Registration No.
                      </label>
                      <input
                        type="text"
                        id="license-no"
                        placeholder="e.g. NGA/HSP/00123"
                        required
                        className={inputStyles}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-medis-light-muted dark:text-medis-gray"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        placeholder="123 Health St, Medville, Lagos"
                        required
                        className={inputStyles}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-medis-light-muted dark:text-medis-gray"
                        >
                          Official Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          placeholder="contact@medisgeneral.ng"
                          required
                          className={inputStyles}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-medis-light-muted dark:text-medis-gray"
                        >
                          Official Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          placeholder="+234 801 234 5678"
                          required
                          className={inputStyles}
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Common password fields - only shown for non-patient roles */}
            {selectedRole !== UserRole.Patient && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-medis-light-muted dark:text-medis-gray"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  defaultValue={isLogin ? "password" : ""}
                  placeholder="••••••••"
                  required
                  className={inputStyles}
                />
              </div>
            )}

            {/* Confirm password field - only shown for non-patient roles during registration */}
            {!isLogin && selectedRole !== UserRole.Patient && (
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-medis-light-muted dark:text-medis-gray"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="••••••••"
                  required
                  className={inputStyles}
                />
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medis-primary hover:bg-medis-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-medis-light-card dark:focus:ring-offset-medis-secondary focus:ring-medis-primary transition-all duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Spinner className="h-5 w-5 text-white" />
            ) : isLogin ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-medis-light-muted dark:text-medis-gray">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setAuthMode(isLogin ? "register" : "login")}
              className="ml-1 font-semibold text-medis-primary hover:underline focus:outline-none"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </motion.button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
