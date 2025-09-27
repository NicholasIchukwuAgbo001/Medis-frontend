// utils/zkLoginUtils.ts
import { fromB64, toB64 } from "@mysten/bcs";
import { sha256 } from "@noble/hashes/sha2.js";
import { base64 } from "@scure/base";

// Mock prover function that simulates requesting a zk proof from a prover service
export const mockProver = async (
  jwt: string,
  ephemeralPublicKey: string,
  salt: string
): Promise<string> => {
  // In a real implementation, this would call an actual prover service
  // For now, we'll generate a mock proof
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockProof = `mock-zk-proof-${jwt.substring(
        0,
        10
      )}-${ephemeralPublicKey.substring(0, 10)}-${salt}`;
      resolve(mockProof);
    }, 1500); // Simulate network delay
  });
};

// Generate a random ephemeral keypair (in a real implementation, this would use actual cryptographic functions)
export const generateEphemeralKeyPair = (): {
  publicKey: string;
  privateKey: string;
} => {
  // This is a mock implementation - in a real app, you would use proper cryptographic libraries
  const privateKey = base64.encode(crypto.getRandomValues(new Uint8Array(32)));
  const publicKey = base64.encode(crypto.getRandomValues(new Uint8Array(32)));
  return { publicKey, privateKey };
};

// Generate a random salt for zkLogin
export const generateSalt = (): string => {
  return base64.encode(crypto.getRandomValues(new Uint8Array(32)));
};

// Decode JWT token (simplified implementation)
export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Derive zkLogin identity from JWT, salt, and ephemeral public key
export const deriveZkLoginIdentity = (
  jwt: string,
  salt: string,
  ephemeralPublicKey: string
): string => {
  // In a real implementation, this would use proper cryptographic functions
  // For this mock, we'll create a deterministic identity based on the inputs
  const data = `${jwt}-${salt}-${ephemeralPublicKey}`;
  const hash = sha256(new TextEncoder().encode(data));
  return base64.encode(hash);
};

// Mock OAuth flow that simulates getting a JWT from Google
export const mockGoogleOAuth = async (): Promise<string> => {
  // In a real implementation, this would redirect to Google OAuth and get a real JWT
  // For now, we'll generate a mock JWT
  return new Promise((resolve) => {
    setTimeout(() => {
      const header = base64.encode(
        new Uint8Array(
          new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" }))
        )
      );
      const payload = base64.encode(
        new Uint8Array(
          new TextEncoder().encode(
            JSON.stringify({
              iss: "https://accounts.google.com",
              sub: "1234567890",
              aud: "mock-google-client-id",
              exp: Math.floor(Date.now() / 1000) + 3600,
              iat: Math.floor(Date.now() / 1000),
              email: "patient@example.com",
              name: "John Doe",
              picture: "https://example.com/profile.jpg",
            })
          )
        )
      );
      const signature = base64.encode(
        crypto.getRandomValues(new Uint8Array(32))
      );
      const mockJWT = `${header}.${payload}.${signature}`;
      resolve(mockJWT);
    }, 1000); // Simulate OAuth redirect delay
  });
};
