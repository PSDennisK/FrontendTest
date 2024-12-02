import {initializeAuthStatus} from '@/lib/auth/client';
import {cookies} from 'next/headers';

export async function initializeAuth() {
  'use server';

  try {
    const setter = () => ({
      set: (name: string, value: string, options = {}) => {
        const cookieStore = cookies();
        cookieStore.set(name, value, options);
      },
    });

    await initializeAuthStatus();
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
}
