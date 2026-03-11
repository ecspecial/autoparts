import apiClient from './client';

export interface OrderItem {
  id: number;
  article: string;
  name: string;
  fullName: string | null;
  marka: string | null;
  model: string | null;
  priceSnapshot: number;
  discount: number | null;
  priceAfterDiscount: number | null;
  quantity: number;
  status: string | null;
  createdAt: string;
}

export interface Order {
  id: number;
  reference: string;
  status: string | null;
  createdAt: string;
  items: OrderItem[];
}

export const ordersApi = {
  createOrder: async (cartItemIds: number[]): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', { cartItemIds });
    return response.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders/my');
    return response.data;
  },
};