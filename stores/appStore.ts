
import { create } from 'zustand';
import { User } from '../types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: 'worker-1',
    username: 'Martin S.',
    email: 'martin@solar.cz',
    role: 'admin'
  },
  setUser: (user) => set({ user }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  isOnline: navigator.onLine,
  setIsOnline: (isOnline) => set({ isOnline }),
}));
