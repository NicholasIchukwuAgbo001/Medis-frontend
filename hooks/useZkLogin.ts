// hooks/useZkLogin.ts
import { useState } from "react";
import {
  mockGoogleOAuth,
  generateEphemeralKeyPair,
  generateSalt,
  decodeJWT,
  deriveZkLoginIdentity,
  mockProver,
} from "../utils/zkLoginUtils";

// Define types for our zkLogin flow
export interface ZkLoginState {
  jwt: string | null;
  ephemeralKeyPair: { publicKey: string; privateKey: string } | null;
  salt: string | null;
  zkLoginIdentity: string | null;
  zkProof: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useZkLogin = () => {
  const [state, setState] = useState<ZkLoginState>({
    jwt: null,
    ephemeralKeyPair: null,
    salt: null,
    zkLoginIdentity: null,
    zkProof: null,
    isLoading: false,
    error: null,
  });

  // Start the zkLogin process
  const startZkLogin = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Step 1: Generate ephemeral keypair
      const ephemeralKeyPair = generateEphemeralKeyPair();

      // Step 2: Generate random salt
      const salt = generateSalt();

      // Step 3: Initiate OAuth flow (mocked for now)
      const jwt = await mockGoogleOAuth();

      // Step 4: Decode JWT to extract user information
      const decodedJWT = decodeJWT(jwt);

      // Step 5: Derive zkLogin identity
      const zkLoginIdentity = deriveZkLoginIdentity(
        jwt,
        salt,
        ephemeralKeyPair.publicKey
      );

      // Step 6: Request zk proof from prover service (mocked for now)
      const zkProof = await mockProver(jwt, ephemeralKeyPair.publicKey, salt);

      // Update state with all the derived information
      setState({
        jwt,
        ephemeralKeyPair,
        salt,
        zkLoginIdentity,
        zkProof,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  };

  // Reset the zkLogin state
  const resetZkLogin = () => {
    setState({
      jwt: null,
      ephemeralKeyPair: null,
      salt: null,
      zkLoginIdentity: null,
      zkProof: null,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...state,
    startZkLogin,
    resetZkLogin,
  };
};
