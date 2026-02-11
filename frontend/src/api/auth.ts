import apiClient from './client';

export interface RegisterData {
  login: string;
  password: string;
  phone: string;
  email: string;
  entityType: string;
  fullName: string;
  captchaId: string;
  captchaText: string;
  discount?: number;
}

export interface LoginData {
  login: string;
  password: string;
}

export interface AuthUser {
  id: number;
  login: string;
  discount: number;
  balance: number;
  isActive: boolean;
  entityType: string;
  fullName: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface UserProfile {
  id: number;
  login: string;
  phone: string;
  email: string;
  entityType: string;
  fullName: string;
  discount: number;
  balance: number;
  isActive: boolean;
  clientNumber1c: string | null;
  preferredDelivery: string | null;
  deliveryAddress: string | null;
  createdAt: string;
}

export interface CaptchaResponse {
  captchaId: string;
  svg: string;
}

export const authApi = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      return response.data;
    },
  
    login: async (data: LoginData): Promise<AuthResponse> => {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      return response.data;
    },
  
    getCaptcha: async (): Promise<CaptchaResponse> => {
      const response = await apiClient.get<CaptchaResponse>('/auth/captcha');
      return response.data;
    },
  
    getProfile: async (): Promise<UserProfile> => {
      const response = await apiClient.get<UserProfile>('/users/profile');
      return response.data;
    },
  
    updateDelivery: async (deliveryCode: string, deliveryName: string): Promise<void> => {
      await apiClient.patch('/users/delivery', { deliveryCode, deliveryName });
    },
  
    updateDeliveryAddress: async (address: string | null): Promise<void> => {
      await apiClient.patch('/users/delivery-address', { address });
    },
  };