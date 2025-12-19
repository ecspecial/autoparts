// Mock shopping cart data

export interface CartItem {
  id: string;
  article: string;
  name: string;
  brand: string;
  model: string;
  year: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
  availability: 'in_stock' | 'on_order' | 'out_of_stock';
}

// Mock cart items (initially populated with some products)
export let cartItems: CartItem[] = [
  {
    id: 'cart1',
    article: 'SDOCT05-880',
    name: 'Капот',
    brand: 'Skoda',
    model: 'Octavia',
    year: '2005',
    category: 'Капоты',
    price: 12900,
    quantity: 1,
    imageUrl: '/product-placeholder.png',
    availability: 'in_stock',
  },
  {
    id: 'cart2',
    article: 'KARIO17-520-L',
    name: 'Крыло переднее левое',
    brand: 'Kia',
    model: 'Rio',
    year: '2017',
    category: 'Крылья',
    price: 6800,
    quantity: 2,
    imageUrl: '/product-placeholder.png',
    availability: 'in_stock',
  },
  {
    id: 'cart3',
    article: 'SDOCT08-071-L',
    name: 'Фара передняя левая',
    brand: 'Skoda',
    model: 'Octavia',
    year: '2008',
    category: 'Фары',
    price: 5800,
    quantity: 1,
    imageUrl: '/product-placeholder.png',
    availability: 'in_stock',
  },
];

// Helper functions for cart management
export const getCartItems = (): CartItem[] => {
  return cartItems;
};

export const getCartTotal = (): number => {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const getCartItemsCount = (): number => {
  return cartItems.reduce((count, item) => count + item.quantity, 0);
};

export const addToCart = (item: CartItem): void => {
  const existingItem = cartItems.find((cartItem) => cartItem.article === item.article);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...item, id: `cart${Date.now()}`, quantity: 1 });
  }
};

export const removeFromCart = (itemId: string): void => {
  cartItems = cartItems.filter((item) => item.id !== itemId);
};

export const updateCartItemQuantity = (itemId: string, quantity: number): void => {
  const item = cartItems.find((cartItem) => cartItem.id === itemId);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      item.quantity = quantity;
    }
  }
};

export const clearCart = (): void => {
  cartItems = [];
};

export const getAvailabilityText = (availability: string): string => {
  switch (availability) {
    case 'in_stock':
      return 'В наличии';
    case 'on_order':
      return 'Под заказ';
    case 'out_of_stock':
      return 'Нет в наличии';
    default:
      return availability;
  }
};

