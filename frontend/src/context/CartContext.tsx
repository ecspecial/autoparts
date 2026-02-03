import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { cartApi } from '../api/cart';
import type { AddToCartData, CartItem, CartResponse } from '../api/cart';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (item: AddToCartData) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = 'guest_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart on mount or auth change
  useEffect(() => {
    if (!authLoading) {
      loadCart();
    }
  }, [isAuthenticated, authLoading]);

  const loadCart = async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        // Load from backend
        const data = await cartApi.getCart();
        setCart(data.items);
        setItemCount(data.itemCount);
        setTotalPrice(data.totalPrice);

        // Clear guest cart after loading backend cart
        localStorage.removeItem(GUEST_CART_KEY);
      } else {
        // Load from localStorage
        const guestCart = loadGuestCart();
        setCart(guestCart);
        calculateTotals(guestCart);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      // If backend fails, try guest cart
      if (isAuthenticated) {
        const guestCart = loadGuestCart();
        setCart(guestCart);
        calculateTotals(guestCart);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadGuestCart = (): CartItem[] => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveGuestCart = (items: CartItem[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  };

  const calculateTotals = (items: CartItem[]) => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);
    setItemCount(count);
    setTotalPrice(total);
  };
  
  const addToCart = async (item: AddToCartData) => {
    try {
      // Validate quantity is positive
      if (item.quantity <= 0) {
        throw new Error('Количество должно быть больше 0');
      }
  
      if (isAuthenticated) {
        // Add to backend
        await cartApi.addToCart(item);
        await refreshCart();
      } else {
        // Add to guest cart
        const guestCart = loadGuestCart();
        const existingIndex = guestCart.findIndex((i) => i.article === item.article);
  
        if (existingIndex >= 0) {
          // Check if adding would exceed available stock
          const newQuantity = guestCart[existingIndex].quantity + item.quantity;
          if (newQuantity > guestCart[existingIndex].currentStock) {
            throw new Error(`Недостаточно товара на складе. Доступно: ${guestCart[existingIndex].currentStock} шт.`);
          }
          guestCart[existingIndex].quantity = newQuantity;
        } else {
          // Validate initial quantity doesn't exceed stock
          if (item.quantity > 99) {  // Default guest stock assumption
            throw new Error('Недостаточно товара на складе');
          }
          
          guestCart.push({
            id: Date.now(),
            ...item,
            addedAt: new Date().toISOString(),
            available: true,
            currentPrice: item.priceSnapshot,
            currentStock: 99,  // Guest users don't know real stock
            priceChanged: false,
          });
        }
  
        saveGuestCart(guestCart);
        setCart(guestCart);
        calculateTotals(guestCart);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;  // Re-throw so button handler can show alert
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      if (isAuthenticated) {
        await cartApi.updateCartItem(itemId, quantity);
        await refreshCart();
      } else {
        const guestCart = loadGuestCart();
        const item = guestCart.find((i) => i.id === itemId);
        if (item) {
          item.quantity = quantity;
          saveGuestCart(guestCart);
          setCart(guestCart);
          calculateTotals(guestCart);
        }
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      if (isAuthenticated) {
        await cartApi.removeFromCart(itemId);
        await refreshCart();
      } else {
        const guestCart = loadGuestCart().filter((i) => i.id !== itemId);
        saveGuestCart(guestCart);
        setCart(guestCart);
        calculateTotals(guestCart);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartApi.clearCart();
        await refreshCart();
      } else {
        localStorage.removeItem(GUEST_CART_KEY);
        setCart([]);
        setItemCount(0);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        totalPrice,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}