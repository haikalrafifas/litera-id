import { create } from 'zustand';
import Cookies from 'js-cookie';
import { decodeToken } from '@/utilities/client/jwt';

interface User {
  token: string | null;
  role: string | null;
  name?: string;
}

interface UserStore extends User {
  setUser: (user: User) => void;
  clearUser: () => void;
  loadFromCookie: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  token: null,
  role: null,
  name: undefined,

  setUser: (user) => set(user),

  clearUser: () => set({ token: null, role: null, name: undefined }),

  // Load user from cookie (JWT) and decode role
  loadFromCookie: () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const payload = decodeToken(token);
        set({
          token,
          role: payload.role || null,
          name: payload.name || undefined,
        });
      } catch (err) {
        console.error('Failed to decode token', err);
        set({ token: null, role: null, name: undefined });
      }
    }
  },
}));
