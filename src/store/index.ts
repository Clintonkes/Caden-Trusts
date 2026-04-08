import { create } from 'zustand'
import { tokenManager } from '@/lib/token'

export interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  accountNumber?: string
  balance?: number
  isActive?: boolean
}

export interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'transfer' | 'bill'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'flagged'
  recipient?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  checkAuth: () => void
}

export interface TransactionState {
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
  getTransactions: () => Transaction[]
}

export interface UIState {
  isLoading: boolean
  setLoading: (loading: boolean) => void
  toasts: Toast[]
  addToast: (toast: Toast) => void
  removeToast: (id: string) => void
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

// Auth Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user: User) => {
    tokenManager.setUser(user as any)
    set({ user, isAuthenticated: true })
  },
  logout: () => {
    tokenManager.clear()
    set({ user: null, isAuthenticated: false })
  },
  updateUser: (userData: Partial<User>) =>
    set((state: AuthState) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    })),
  checkAuth: () => {
    const token = tokenManager.getToken()
    const user = tokenManager.getUser()
    if (token && user) {
      set({ user: { ...user, id: String(user.id) } as User, isAuthenticated: true })
    }
  },
}))

// Transaction Store
export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [
    {
      id: '1',
      type: 'deposit',
      amount: 5000,
      description: 'Salary Deposit',
      date: '2024-03-20',
      status: 'completed',
    },
    {
      id: '2',
      type: 'transfer',
      amount: -1500,
      description: 'Transfer to John Doe',
      date: '2024-03-18',
      status: 'completed',
      recipient: 'John Doe',
    },
    {
      id: '3',
      type: 'bill',
      amount: -500,
      description: 'Electricity Bill',
      date: '2024-03-15',
      status: 'completed',
    },
    {
      id: '4',
      type: 'withdrawal',
      amount: -1000,
      description: 'ATM Withdrawal',
      date: '2024-03-10',
      status: 'completed',
    },
    {
      id: '5',
      type: 'deposit',
      amount: 2500,
      description: 'Freelance Payment',
      date: '2024-03-05',
      status: 'completed',
    },
  ],
  addTransaction: (transaction: Transaction) =>
    set((state: TransactionState) => ({
      transactions: [transaction, ...state.transactions],
    })),
  getTransactions: () => get().transactions,
}))

// UI Store
export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  toasts: [],
  addToast: (toast: Toast) =>
    set((state: UIState) => ({
      toasts: [...state.toasts, toast],
    })),
  removeToast: (id: string) =>
    set((state: UIState) => ({
      toasts: state.toasts.filter((t: Toast) => t.id !== id),
    })),
}))

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    accountNumber: '1234567890',
    balance: 25000,
    isActive: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'customer',
    accountNumber: '0987654321',
    balance: 15000,
    isActive: true,
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@caden.com',
    role: 'admin',
    isActive: true,
  },
]

