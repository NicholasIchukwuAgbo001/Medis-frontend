import React, { useState } from "react";
import { User, UserRole } from "../types";
import { MOCK_USERS } from "../constants";
import { LogoIcon, CloseIcon } from "../components/icons/IconComponents";
import Spinner from "../components/Spinner";
import { motion } from "framer-motion";

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onClose: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onClose }) => {
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
                  <div>
                    <label
                      htmlFor="medis-id"
                      className="block text-sm font-medium text-medis-light-muted dark:text-medis-gray"
                    >
                      Medis Patient ID
                    </label>
                    <input
                      type="text"
                      id="medis-id"
                      defaultValue="PAT001"
                      required
                      className={inputStyles}
                    />
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
                  <>
                    <div>
                      <label
                        htmlFor="medis-id"
                        className="block text-sm font-medium text-medis-light-muted dark:text-medis-gray"
                      >
                        Medis Patient ID
                      </label>
                      <input
                        type="text"
                        id="medis-id"
                        placeholder="Will be assigned upon registration"
                        readOnly
                        className={`${inputStyles} cursor-not-allowed bg-gray-100 dark:bg-medis-secondary-dark/50`}
                      />
                    </div>
                  </>
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

            {/* Common password fields */}
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

            {!isLogin && (
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
