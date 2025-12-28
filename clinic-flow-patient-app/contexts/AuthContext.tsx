import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, Patient, LoginPayload, RegisterPayload } from '../services/auth';

// ============================================
// DEVELOPMENT MODE CONFIGURATION
// Set to true to simulate a logged-in user
// ============================================
const DEV_SIMULATE_LOGIN = true;

const MOCK_PATIENT: Patient = {
  id: 'dev-patient-001',
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  phone: '+201234567890',
  dateOfBirth: '1990-05-15',
  gender: 'male',
  createdAt: new Date().toISOString(),
};

const MOCK_TOKEN = 'dev-mock-token-12345';
// ============================================

interface AuthContextType {
  patient: Patient | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  isDevMode: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updatePatient: (data: Partial<Patient>) => void;
  setGuestInfo: (name: string, phone: string, email?: string) => void;
  updateProfile: (data: Partial<Patient>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const TOKEN_KEY = 'patient-auth-token';
const PATIENT_KEY = 'patient-data';
const GUEST_KEY = 'patient-guest-info';
const DEV_LOGOUT_KEY = 'patient-dev-logout-flag';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestInfo, setGuestInfoState] = useState<{ name: string; phone: string; email?: string } | null>(null);

  // Load stored auth on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        // Development mode: simulate logged-in user
        if (DEV_SIMULATE_LOGIN && __DEV__) {
          // Check if user explicitly logged out
          const wasLoggedOut = await AsyncStorage.getItem(DEV_LOGOUT_KEY);
          if (wasLoggedOut !== 'true') {
            console.log('🔧 DEV MODE: Simulating logged-in user');
            setToken(MOCK_TOKEN);
            setPatient(MOCK_PATIENT);
            setIsLoading(false);
            return;
          }
        }

        const [storedToken, storedPatient, storedGuest] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(PATIENT_KEY),
          AsyncStorage.getItem(GUEST_KEY),
        ]);

        if (storedToken && storedPatient) {
          setToken(storedToken);
          setPatient(JSON.parse(storedPatient));
        }

        if (storedGuest) {
          setGuestInfoState(JSON.parse(storedGuest));
        }
      } catch (error) {
        console.error('Failed to load auth', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const isAuthenticated = Boolean(token && patient);
  const isGuest = !isAuthenticated && Boolean(guestInfo);

  const login = useCallback(async (data: LoginPayload) => {
    setIsLoading(true);
    try {
      let responseToken: string;
      let responsePatient: Patient;

      // Development mode: use mock login (skip API)
      if (DEV_SIMULATE_LOGIN && __DEV__) {
        console.log('🔧 DEV MODE: Mock login with:', data.email);
        responseToken = MOCK_TOKEN;
        responsePatient = { ...MOCK_PATIENT, email: data.email };
      } else {
        const response = await authApi.login(data);
        responseToken = response.token;
        responsePatient = response.patient;
      }

      setToken(responseToken);
      setPatient(responsePatient);
      
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, responseToken),
        AsyncStorage.setItem(PATIENT_KEY, JSON.stringify(responsePatient)),
        AsyncStorage.removeItem(DEV_LOGOUT_KEY), // Clear logout flag to allow dev auto-login
      ]);
      
      // Clear guest info on successful login
      await AsyncStorage.removeItem(GUEST_KEY);
      setGuestInfoState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      setToken(response.token);
      setPatient(response.patient);
      
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, response.token),
        AsyncStorage.setItem(PATIENT_KEY, JSON.stringify(response.patient)),
      ]);
      
      // Clear guest info on successful registration
      await AsyncStorage.removeItem(GUEST_KEY);
      setGuestInfoState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setToken(null);
    setPatient(null);
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(PATIENT_KEY),
      AsyncStorage.setItem(DEV_LOGOUT_KEY, 'true'), // Mark as logged out to prevent dev auto-login
    ]);
  }, []);

  const updatePatient = useCallback((data: Partial<Patient>) => {
    setPatient((prev: Patient | null) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      AsyncStorage.setItem(PATIENT_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setGuestInfo = useCallback(async (name: string, phone: string, email?: string) => {
    const info = { name, phone, email };
    setGuestInfoState(info);
    await AsyncStorage.setItem(GUEST_KEY, JSON.stringify(info));
  }, []);

  const updateProfile = useCallback(async (data: Partial<Patient>) => {
    if (!patient) throw new Error('Not authenticated');
    
    const updatedPatient = { ...patient, ...data };
    setPatient(updatedPatient);
    await AsyncStorage.setItem(PATIENT_KEY, JSON.stringify(updatedPatient));
    
    // In production, also call API
    // await authApi.updateProfile(data);
  }, [patient]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!patient) throw new Error('Not authenticated');
    
    // In production, call API
    // await authApi.changePassword({ currentPassword, newPassword });
    
    // For now, just simulate success
    console.log('Password changed successfully');
  }, [patient]);

  const value = useMemo(() => ({
    patient: patient || (guestInfo ? { 
      id: 'guest', 
      name: guestInfo.name, 
      phone: guestInfo.phone, 
      email: guestInfo.email || '' 
    } as Patient : null),
    token,
    isAuthenticated,
    isGuest,
    isLoading,
    isDevMode: DEV_SIMULATE_LOGIN && __DEV__,
    login,
    register,
    logout,
    updatePatient,
    setGuestInfo,
    updateProfile,
    changePassword,
  }), [patient, token, isAuthenticated, isGuest, isLoading, login, register, logout, updatePatient, setGuestInfo, guestInfo, updateProfile, changePassword]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
