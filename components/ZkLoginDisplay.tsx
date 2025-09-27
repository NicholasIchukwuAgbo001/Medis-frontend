// components/ZkLoginDisplay.tsx
import React from "react";
import { useZkLogin } from "../hooks/useZkLogin";

const ZkLoginDisplay: React.FC = () => {
  const {
    jwt,
    ephemeralKeyPair,
    salt,
    zkLoginIdentity,
    zkProof,
    isLoading,
    error,
    resetZkLogin,
  } = useZkLogin();

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-medis-secondary rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center space-y-4">
          <svg
            className="w-12 h-12 text-medis-primary animate-spin"
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
          <p className="text-lg font-medium text-medis-light-text dark:text-medis-dark">
            Processing zkLogin...
          </p>
          <p className="text-medis-light-muted dark:text-medis-gray">
            Generating zero-knowledge proof
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-medis-secondary rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <p className="text-lg font-medium text-medis-light-text dark:text-medis-dark">
            Authentication Error
          </p>
          <p className="text-medis-light-muted dark:text-medis-gray">{error}</p>
          <button
            onClick={resetZkLogin}
            className="px-4 py-2 text-sm font-medium text-white bg-medis-primary rounded-md hover:bg-medis-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medis-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!zkLoginIdentity) {
    return null;
  }

  return (
    <div className="p-6 bg-white dark:bg-medis-secondary rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-medis-light-text dark:text-medis-dark">
          zkLogin Successful
        </h2>
        <button
          onClick={resetZkLogin}
          className="px-3 py-1 text-sm font-medium text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-medis-dark focus:outline-none"
        >
          Reset
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-medis-light-text dark:text-medis-dark mb-2">
            Patient Identity
          </h3>
          <div className="p-4 bg-medis-light-bg dark:bg-medis-secondary-dark rounded-md">
            <p className="text-medis-light-text dark:text-medis-dark break-all font-mono text-sm">
              {zkLoginIdentity}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-medis-light-text dark:text-medis-dark mb-2">
            Zero-Knowledge Proof
          </h3>
          <div className="p-4 bg-medis-light-bg dark:bg-medis-secondary-dark rounded-md">
            <p className="text-medis-light-text dark:text-medis-dark break-all font-mono text-sm">
              {zkProof}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-md font-medium text-medis-light-text dark:text-medis-dark mb-2">
              Ephemeral Public Key
            </h4>
            <div className="p-3 bg-medis-light-bg dark:bg-medis-secondary-dark rounded-md">
              <p className="text-medis-light-text dark:text-medis-dark break-all font-mono text-xs">
                {ephemeralKeyPair?.publicKey}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-medis-light-text dark:text-medis-dark mb-2">
              Salt
            </h4>
            <div className="p-3 bg-medis-light-bg dark:bg-medis-secondary-dark rounded-md">
              <p className="text-medis-light-text dark:text-medis-dark break-all font-mono text-xs">
                {salt}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-medis-light-text dark:text-medis-dark mb-2">
            JWT Payload
          </h3>
          <div className="p-4 bg-medis-light-bg dark:bg-medis-secondary-dark rounded-md">
            <pre className="text-medis-light-text dark:text-medis-dark break-all font-mono text-xs">
              {JSON.stringify(
                JSON.parse(
                  atob(
                    jwt?.split(".")[1].replace(/-/g, "+").replace(/_/g, "/") ||
                      "{}"
                  )
                ),
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZkLoginDisplay;
