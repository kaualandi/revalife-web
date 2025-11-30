import { devtools } from 'zustand/middleware';
import { create } from 'zustand';

// Exemplo de store de usuário (sem persist para dados sensíveis)
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(set => ({
    user: null,
    setUser: user => set({ user }),
    clearUser: () => set({ user: null }),
  }))
);
