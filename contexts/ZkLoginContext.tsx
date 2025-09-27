// contexts/ZkLoginContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { useZkLogin } from "../hooks/useZkLogin";

// Create the context
const ZkLoginContext = createContext<ReturnType<typeof useZkLogin> | undefined>(
  undefined
);

// Provider component
export const ZkLoginProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const zkLogin = useZkLogin();

  return (
    <ZkLoginContext.Provider value={zkLogin}>
      {children}
    </ZkLoginContext.Provider>
  );
};

// Hook to use the context
export const useZkLoginContext = () => {
  const context = useContext(ZkLoginContext);
  if (context === undefined) {
    throw new Error("useZkLoginContext must be used within a ZkLoginProvider");
  }
  return context;
};
