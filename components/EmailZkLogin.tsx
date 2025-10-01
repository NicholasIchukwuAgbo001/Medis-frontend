// components/EmailZkLogin.tsx
import React, { useState } from "react";

interface EmailLoginProps {
  onLogin: (user: any) => void;
  onClose?: () => void;
}

const EmailLogin: React.FC<EmailLoginProps> = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);
  const [patientId, setPatientId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (isLoginView) {
      // Login validation
      if (!password) {
        setError("Please enter your password");
        return;
      }
    } else {
      // Registration validation
      if (!patientId) {
        setError("Please enter your patient ID");
        return;
      }

      if (!password) {
        setError("Please enter a password");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Close the current modal if there is one
      if (onClose) {
        onClose();
      }

      // Simulate API call
      setTimeout(() => {
        onLogin({
          id: patientId || "PAT001",
          name: isLoginView ? email.split("@")[0] : patientId,
          email: email,
          role: "Patient",
          avatarUrl: "https://example.com/profile.jpg",
        });
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      setError("Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-medis-light-text dark:text-medis-dark text-center">
          {isLoginView ? "Sign in to your account" : "Create a new account"}
        </h2>
        <p className="mt-2 text-medis-light-muted dark:text-medis-gray text-center">
          {isLoginView
            ? "Enter your credentials to access your patient portal"
            : "Complete the form to create your patient account"}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
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
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLoginView && (
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
                required={!isLoginView}
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="block w-full px-3 py-2 placeholder-medis-light-muted dark:placeholder-medis-gray border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm appearance-none focus:outline-none focus:ring-medis-primary focus:border-medis-primary dark:bg-medis-secondary dark:text-medis-dark sm:text-sm"
                placeholder="e.g., PAT-001"
              />
            </div>
          </div>
        )}

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
              className="block w-full px-3 py-2 placeholder-medis-light-muted dark:placeholder-medis-gray border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm appearance-none focus:outline-none focus:ring-medis-primary focus:border-medis-primary dark:bg-medis-secondary dark:text-medis-dark sm:text-sm"
              placeholder="you@example.com"
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
              autoComplete={isLoginView ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 placeholder-medis-light-muted dark:placeholder-medis-gray border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm appearance-none focus:outline-none focus:ring-medis-primary focus:border-medis-primary dark:bg-medis-secondary dark:text-medis-dark sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        {!isLoginView && (
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
                autoComplete="new-password"
                required={!isLoginView}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-3 py-2 placeholder-medis-light-muted dark:placeholder-medis-gray border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm appearance-none focus:outline-none focus:ring-medis-primary focus:border-medis-primary dark:bg-medis-secondary dark:text-medis-dark sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white bg-medis-primary rounded-md shadow-sm hover:bg-medis-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medis-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="w-5 h-5 mr-2 animate-spin"
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
                {isLoginView ? "Signing in..." : "Creating account..."}
              </>
            ) : isLoginView ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-medis-light-border dark:border-medis-light-gray"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-medis-light-card dark:bg-medis-secondary text-medis-light-muted dark:text-medis-gray">
            {isLoginView ? "New to Medis?" : "Already have an account?"}
          </span>
        </div>
      </div>

      <div>
        <button
          onClick={() => setIsLoginView(!isLoginView)}
          className="w-full flex justify-center py-2 px-4 border border-medis-light-border dark:border-medis-light-gray rounded-md shadow-sm text-sm font-medium text-medis-light-text dark:text-medis-dark bg-white dark:bg-medis-secondary hover:bg-medis-light-bg dark:hover:bg-medis-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medis-primary"
        >
          {isLoginView ? "Create new account" : "Sign in to existing account"}
        </button>
      </div>
    </div>
  );
};

export default EmailLogin;
