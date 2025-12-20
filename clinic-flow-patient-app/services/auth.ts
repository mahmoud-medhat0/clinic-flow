import { api } from './api';

export interface Patient {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female';
    avatar?: string;
    createdAt?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
}

export interface AuthResponse {
    token: string;
    patient: Patient;
}

export interface UpdateProfilePayload {
    name?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female';
}

export interface ChangePasswordPayload {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export const authApi = {
    /**
     * Login with email and password
     */
    login: (data: LoginPayload) =>
        api.post<AuthResponse>('/auth/login', data, { skipAuth: true }),

    /**
     * Register a new patient account
     */
    register: (data: RegisterPayload) =>
        api.post<AuthResponse>('/auth/register', data, { skipAuth: true }),

    /**
     * Logout (invalidate token)
     */
    logout: () => api.post<void>('/auth/logout'),

    /**
     * Get current patient profile
     */
    getProfile: () => api.get<Patient>('/me'),

    /**
     * Update patient profile
     */
    updateProfile: (data: UpdateProfilePayload) =>
        api.put<Patient>('/me', data),

    /**
     * Change password
     */
    changePassword: (data: ChangePasswordPayload) =>
        api.post<void>('/auth/change-password', data),

    /**
     * Request password reset
     */
    forgotPassword: (email: string) =>
        api.post<void>('/auth/forgot-password', { email }, { skipAuth: true }),

    /**
     * Reset password with token
     */
    resetPassword: (token: string, password: string, passwordConfirmation: string) =>
        api.post<void>('/auth/reset-password', {
            token,
            password,
            password_confirmation: passwordConfirmation,
        }, { skipAuth: true }),

    /**
     * Convert guest booking to registered account
     */
    convertGuest: (phone: string, password: string) =>
        api.post<AuthResponse>('/auth/convert-guest', { phone, password }),
};
