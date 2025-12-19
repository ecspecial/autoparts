// Mock user data for authentication and profile

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  balance: number;
  paymentMethod: 'card' | 'cash' | 'online';
  deliveryMethod: 'courier' | 'pickup' | 'post';
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  date: string; // ISO date string
  totalPrice: number;
  status: 'completed' | 'new' | 'processing' | 'pending' | 'cancelled';
  items: {
    article: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

// Mock current user (in real app, this would come from auth)
export const currentUser: User = {
  id: 'user1',
  email: 'user@example.com',
  name: 'Иван Иванов',
  phone: '+7 (999) 123-45-67',
  balance: 1000,
  paymentMethod: 'card',
  deliveryMethod: 'courier',
};

// Mock orders data
export const ordersData: Order[] = [
  {
    id: 'order1',
    orderNumber: '1234',
    userId: 'user1',
    date: '2024-03-01T10:30:00',
    totalPrice: 3950,
    status: 'completed',
    items: [
      { article: 'SDOCT05-880', name: 'Капот', quantity: 1, price: 3950 },
    ],
  },
  {
    id: 'order2',
    orderNumber: '1235',
    userId: 'user1',
    date: '2024-03-10T14:20:00',
    totalPrice: 7120,
    status: 'pending',
    items: [
      { article: 'KARIO17-520-L', name: 'Крыло переднее левое', quantity: 1, price: 6800 },
      { article: 'SDOCT08-455-L', name: 'Зеркало левое', quantity: 1, price: 320 },
    ],
  },
  {
    id: 'order3',
    orderNumber: '1236',
    userId: 'user1',
    date: '2024-03-31T09:15:00',
    totalPrice: 24670,
    status: 'new',
    items: [
      { article: 'BME3405-892', name: 'Капот', quantity: 1, price: 18900 },
      { article: 'BME3405-023L-Z', name: 'Зеркало левое с подогревом', quantity: 1, price: 4500 },
      { article: 'HYSOL14-678-L', name: 'Крыло переднее левое', quantity: 2, price: 1270 },
    ],
  },
  {
    id: 'order4',
    orderNumber: '1237',
    userId: 'user1',
    date: '2024-04-15T16:45:00',
    totalPrice: 15800,
    status: 'completed',
    items: [
      { article: 'VWGLF09-120', name: 'Капот', quantity: 1, price: 15800 },
    ],
  },
];

// Helper functions
export const getOrdersByUserId = (userId: string): Order[] => {
  return ordersData.filter(order => order.userId === userId);
};

export const getOrderStatusText = (status: Order['status']): string => {
  switch (status) {
    case 'completed':
      return 'Завершён';
    case 'new':
      return 'Новый';
    case 'processing':
      return 'Обрабатывается';
    case 'pending':
      return 'Ожидает';
    case 'cancelled':
      return 'Отменён';
    default:
      return status;
  }
};

export const getOrderStatusClass = (status: Order['status']): string => {
  switch (status) {
    case 'completed':
      return 'status-completed';
    case 'new':
      return 'status-new';
    case 'processing':
      return 'status-processing';
    case 'pending':
      return 'status-pending';
    case 'cancelled':
      return 'status-cancelled';
    default:
      return '';
  }
};

export const getPaymentMethodText = (method: User['paymentMethod']): string => {
  switch (method) {
    case 'card':
      return 'Банковская карта';
    case 'cash':
      return 'Наличные';
    case 'online':
      return 'Онлайн оплата';
    default:
      return method;
  }
};

export const getDeliveryMethodText = (method: User['deliveryMethod']): string => {
  switch (method) {
    case 'courier':
      return 'Курьером';
    case 'pickup':
      return 'Самовывоз';
    case 'post':
      return 'Почта России';
    default:
      return method;
  }
};

