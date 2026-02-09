import apiClient from './client';

export interface DeliveryMethod {
  id: number;
  code1c: string;
  name: string;
}

export const deliveryApi = {
  getMethods: async (): Promise<DeliveryMethod[]> => {
    const response = await apiClient.get<DeliveryMethod[]>('/delivery/methods');
    return response.data;
  },
};