import apiClient from './client';

export interface RegisterData {
  login: string;
  password: string;
  discount?: number;
}

export interface LoginData {
  login: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    login: string;
    discount: number;
    createdAt: string;
  };
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
};