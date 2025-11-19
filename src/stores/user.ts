import { create } from 'zustand';
import Cookies from 'js-cookie';
import { decodeToken } from '@/utilities/client/jwt';
import type { TokenUser } from '@/interfaces/token-user';

interface UserStoreState extends TokenUser {
  token: string | null;
}

interface UserStore extends UserStoreState {
  setUser: (user: UserStoreState) => void;
  updateUser: (partial: Partial<UserStoreState>) => void;
  clearUser: () => void;
  loadFromCookie: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  token: null,
  sub: null,
  role: null,
  name: null,
  username: null,
  image: null,

  setUser: (user) => set(user),

  updateUser: (partial) => set(partial),

  clearUser: () => set({ token: null, sub: null, role: null, name: null, username: null, image: null }),
  // Load user from cookie (JWT) and decode role
  loadFromCookie: () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const payload = decodeToken(token);
        set({
          token,
          sub: payload.sub || null,
          role: payload.role || null,
          name: payload.name || null,
          username: payload.username || null,
          image: payload.image || null,
        });
      } catch (err) {
        console.error('Failed to decode token', err);
        set({ token: null, sub: null, role: null, name: null, username: null, image: null });
      }
    }
  },
}));
