
import React, { createContext, useState, useContext } from 'react';
import db, { User } from '@/lib/databaseSimulation';
import { useToast } from '@/components/ui/use-toast';

interface SecurityContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  secureMode: boolean;
  loginUser: (username: string, password: string) => boolean;
  logoutUser: () => void;
  registerUser: (email: string, username: string, password: string) => boolean;
  requestPasswordReset: (email: string) => { token: string; expiry: number } | null;
  resetPassword: (email: string, token: string, newPassword: string) => boolean;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
  toggleSecureMode: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [secureMode, setSecureMode] = useState<boolean>(true);
  const { toast } = useToast();

  const loginUser = (username: string, password: string): boolean => {
    let user;
    
    if (secureMode) {
      user = db.secureLogin(username, password);
    } else {
      user = db.vulnerableLogin(username, password);
    }
    
    if (user) {
      setCurrentUser(user);
      return true;
    }
    
    return false;
  };

  const logoutUser = (): void => {
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const registerUser = (email: string, username: string, password: string): boolean => {
    let user;
    
    if (secureMode) {
      user = db.secureRegisterUser(email, username, password);
    } else {
      user = db.vulnerableRegisterUser(email, username, password);
    }
    
    if (user) {
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Registration failed",
      description: "Username already exists or an error occurred.",
    });
    return false;
  };

  const requestPasswordReset = (email: string) => {
    return db.requestPasswordReset(email);
  };

  const resetPassword = (email: string, token: string, newPassword: string): boolean => {
    return db.resetPassword(email, token, newPassword);
  };

  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    if (!currentUser) {
      return false;
    }

    return db.changePassword(currentUser.username, currentPassword, newPassword);
  };

  const toggleSecureMode = (): void => {
    setSecureMode(prev => !prev);
    toast({
      title: `${!secureMode ? "Secure" : "Vulnerable"} mode enabled`,
      description: `The system is now in ${!secureMode ? "secure" : "vulnerable"} mode.`,
      variant: !secureMode ? "default" : "destructive",
    });
  };

  return (
    <SecurityContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        secureMode,
        loginUser,
        logoutUser,
        registerUser,
        requestPasswordReset,
        resetPassword,
        changePassword,
        toggleSecureMode,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
