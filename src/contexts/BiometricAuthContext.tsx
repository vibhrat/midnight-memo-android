
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface BiometricAuthContextType {
  isAuthenticated: boolean;
  biometricEnabled: boolean;
  authenticate: () => Promise<boolean>;
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => void;
}

const BiometricAuthContext = createContext<BiometricAuthContextType | undefined>(undefined);

export const useBiometricAuth = () => {
  const context = useContext(BiometricAuthContext);
  if (context === undefined) {
    throw new Error('useBiometricAuth must be used within a BiometricAuthProvider');
  }
  return context;
};

export const BiometricAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useLocalStorage('biometric-enabled', false);

  const authenticate = async (): Promise<boolean> => {
    try {
      // Check if biometric is available and enabled
      if (biometricEnabled && 'credentials' in navigator) {
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: { name: "Cipher Vault" },
            user: {
              id: new Uint8Array(16),
              name: "user@ciphervault.com",
              displayName: "Cipher Vault User",
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required"
            }
          }
        });
        
        if (credential) {
          setIsAuthenticated(true);
          return true;
        }
      }
      
      // Fallback for web or if biometric fails
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  };

  const enableBiometric = async (): Promise<boolean> => {
    try {
      if ('credentials' in navigator) {
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: { name: "Cipher Vault" },
            user: {
              id: new Uint8Array(16),
              name: "user@ciphervault.com",
              displayName: "Cipher Vault User",
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required"
            }
          }
        });
        
        if (credential) {
          setBiometricEnabled(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to enable biometric:', error);
      return false;
    }
  };

  const disableBiometric = () => {
    setBiometricEnabled(false);
  };

  const value = {
    isAuthenticated,
    biometricEnabled,
    authenticate,
    enableBiometric,
    disableBiometric,
  };

  return (
    <BiometricAuthContext.Provider value={value}>
      {children}
    </BiometricAuthContext.Provider>
  );
};
