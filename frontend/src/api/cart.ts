import apiClient from './client';

export interface CartItem {
  id: number;
  article: string;
  name: string;
  fullName: string;
  marka: string;
  model: string;
  priceSnapshot: number;
  quantity: number;
  addedAt: string;
  available: boolean;
  currentPrice: number | null;
  currentStock: number;
  priceChanged: boolean;
}

export interface CartResponse {
  cartId: number;
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
}

export interface AddToCartData {
  article: string;
  quantity: number;
  name: string;
  fullName: string;
  marka: string;
  model: string;
  priceSnapshot: number;
}

export const cartApi = {
  // Get cart with availability info
  getCart: async (): Promise<CartResponse> => {
    const response = await apiClient.get<CartResponse>('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (data: AddToCartData): Promise<void> => {
    await apiClient.post('/cart/add', data);
  },

  // Update cart item quantity
  updateCartItem: async (itemId: number, quantity: number): Promise<void> => {
    await apiClient.put(`/cart/items/${itemId}`, { quantity });
  },

  // Remove item from cart
  removeFromCart: async (itemId: number): Promise<void> => {
    await apiClient.delete(`/cart/items/${itemId}`);
  },

  // Clear cart
  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart/clear');
  },

  // Merge guest cart with user cart on login
  mergeGuestCart: async (guestItems: AddToCartData[]): Promise<void> => {
    await apiClient.post('/cart/merge', guestItems);
  },
};