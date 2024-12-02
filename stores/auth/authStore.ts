import {validateToken} from '@/lib/auth/client';
import {getPsFoodbookTokenCookieName} from '@/utils/helpers';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

const STORAGE_KEY = 'ps-foodbook-auth';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  initialize: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      setToken: token => {
        set({token});
      },
      initialize: async () => {
        if (typeof window === 'undefined') return;

        try {
          // Check localStorage first
          const storedAuth = localStorage.getItem(STORAGE_KEY);
          if (storedAuth) {
            const {state} = JSON.parse(storedAuth);
            if (state?.token) {
              const {isValid} = await validateToken(state.token);
              if (isValid) {
                set({token: state.token});
                return;
              }
            }
          }

          // Try cookie if no valid stored token
          const cookieName = getPsFoodbookTokenCookieName();
          const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${cookieName}=`));

          if (cookie) {
            const cookieToken = cookie.split('=')[1];
            const {isValid} = await validateToken(cookieToken);
            if (isValid) {
              set({token: cookieToken});
            }
          }
        } catch (error) {
          console.error('Error initializing auth store:', error);
          set({token: null});
        }
      },
    }),
    {
      name: STORAGE_KEY,
    },
  ),
);

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const state = useAuthStore.getState();
    const token = state.token;
    return token;
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

export default useAuthStore;
