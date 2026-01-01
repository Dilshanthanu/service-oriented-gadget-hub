import productsData from '../data/products.json';
import distributorsData from '../data/distributors.json';
import ordersData from '../data/orders.json';
import usersData from '../data/users.json';

export type Role = 'customer' | 'admin' | 'distributor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  username?: string;
  password?: string; // In real app, never store/return plain password
  avatar?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

export interface Distributor {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
  role?: Role; // Optional for login, inferred or checked
}

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Auth Services ---

export const login = async (credentials: LoginCredentials): Promise<User> => {
  await delay(800);

  // Find user by email OR username
  const user = usersData.find(
    (u) =>
      (u.email === credentials.email || u.username === credentials.email) && // flexible login
      u.password === credentials.password,
  ) as User | undefined;

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Optional: Check if role matches if provided
  if (credentials.role && user.role !== credentials.role) {
    throw new Error(`Access denied. You are not a ${credentials.role}.`);
  }

  return user;
};

export const loginWithGoogle = async (): Promise<User> => {
  await delay(1000);
  // Simulate Google User
  const googleUser: User = {
    id: 'google-123',
    name: 'Google User',
    email: 'user@gmail.com',
    role: 'customer',
    avatar: 'https://lh3.googleusercontent.com/a/default-user',
  };
  return googleUser;
};

export const registerCustomer = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  await delay(800);
  if (usersData.some((u) => u.email === data.email)) {
    throw new Error('Email already exists');
  }

  const newUser: User = {
    id: String(Date.now()),
    role: 'customer',
    ...data,
    username: data.email.split('@')[0],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
  };

  return newUser;
};

// --- User Management Services (Admin) ---

export const getUsers = async (): Promise<User[]> => {
  await delay(500);
  return usersData as User[];
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  await delay(600);
  // In a real app this would POST to backend
  // We can't persist to JSON file in browser, but we can return the object
  const newUser = { ...user, id: String(Date.now()) };
  // Mock adding to local list for the session (won't persist reload)
  console.log('User created:', newUser);
  return newUser;
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
  await delay(500);
  const user = usersData.find((u) => u.id === id);
  if (!user) throw new Error('User not found');
  return { ...user, ...updates } as User;
};

export const deleteUser = async (id: string): Promise<void> => {
  await delay(500);
  console.log('User deleted:', id);
};

// --- Product & Order Services ---

export const getProducts = async (): Promise<Product[]> => {
  await delay(500);
  return productsData;
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  await delay(300);
  return productsData.find((p) => p.id === id);
};

export const getOrders = async (): Promise<any[]> => {
  await delay(600);
  return ordersData;
};

export const placeOrder = async (order: any): Promise<boolean> => {
  await delay(1000);
  console.log('Order placed:', order);
  return true;
};
