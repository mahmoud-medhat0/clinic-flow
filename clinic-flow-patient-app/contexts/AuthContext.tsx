import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, Patient, LoginPayload, RegisterPayload } from '../services/auth';

interface AuthContextType {
  patient: Patient | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updatePatient: (data: Partial<Patient>) => void;
  setGuestInfo: (name: string, phone: string, email?: string) => void;
}

const TOKEN_KEY = 'patient-auth-token';
const PATIENT_KEY = 'patient-data';
const GUEST_KEY = 'patient-guest-info';

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
      const response = await authApi.login(data);
      setToken(response.token);
      setPatient(response.patient);
      
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, response.token),
        AsyncStorage.setItem(PATIENT_KEY, JSON.stringify(response.patient)),
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
    login,
    register,
    logout,
    updatePatient,
    setGuestInfo,
  }), [patient, token, isAuthenticated, isGuest, isLoading, login, register, logout, updatePatient, setGuestInfo, guestInfo]);

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
