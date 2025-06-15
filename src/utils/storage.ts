import { Transaction, User, Budget } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_tracker_transactions',
  USER: 'finance_tracker_user',
  BUDGETS: 'finance_tracker_budgets',
  THEME: 'finance_tracker_theme',
};

export const storage = {
  // Transactions
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  saveTransactions: (transactions: Transaction[]): void => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  addTransaction: (transaction: Transaction): void => {
    const transactions = storage.getTransactions();
    transactions.unshift(transaction);
    storage.saveTransactions(transactions);
  },

  updateTransaction: (id: string, updatedTransaction: Partial<Transaction>): void => {
    const transactions = storage.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updatedTransaction };
      storage.saveTransactions(transactions);
    }
  },

  deleteTransaction: (id: string): void => {
    const transactions = storage.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    storage.saveTransactions(filtered);
  },

  // User
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  saveUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // Budgets
  getBudgets: (): Budget[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return data ? JSON.parse(data) : [];
  },

  saveBudgets: (budgets: Budget[]): void => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  },

  // Theme
  getTheme: (): 'light' | 'dark' => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  },

  saveTheme: (theme: 'light' | 'dark'): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },
};