// components/EmailZkLogin.tsx
import React, { useState } from "react";
import { useZkLogin } from "../hooks/useZkLogin";

interface EmailZkLoginProps {
  onLogin: (user: any) => void;
  onClose?: () => void;
}

const EmailZkLogin: React.FC<EmailZkLoginProps> = ({ onLogin, onClose }) => {
  const { startZkLogin, isLoading, error } = useZkLogin();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Close the current modal if there is one
      if (onClose) {
        onClose();
      }

      // Start the zkLogin process
      await startZkLogin();

      // After successful zkLogin, navigate to the patient dashboard
      // Simulate API call to verify zk proof
      setTimeout(() => {
        // For demo purposes, we'll use the email provided by the user
        // In a real app, you would get the user data from your backend after verifying the zk proof
        onLogin({
          id: "PAT001",
          name: email.split("@")[0], // Use the part before @ as the name
          email: email,
          role: "Patient",
          avatarUrl: "https://example.com/profile.jpg",
        });
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white bg-medis-primary rounded-md shadow-sm hover:bg-medis-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medis-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting || isLoading ? (
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
                Authenticating...
              </>
            ) : (
              "Continue with Email"
            )}
          </button>
        </div>
      </form>

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
            Email Verification
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
  );
};

export default EmailZkLogin;
