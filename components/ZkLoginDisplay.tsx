// components/ZkLoginDisplay.tsx
import React from "react";

const LoginSuccessDisplay: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-medis-secondary rounded-lg shadow-md">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <p className="text-lg font-medium text-medis-light-text dark:text-medis-dark">
          Login Successful
        </p>
        <p className="text-medis-light-muted dark:text-medis-gray">
          You have been successfully authenticated
        </p>
      </div>
    </div>
  );
};

export default LoginSuccessDisplay;
