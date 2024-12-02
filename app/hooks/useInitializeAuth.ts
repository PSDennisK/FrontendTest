import useAuthStore from '@/stores/auth/authStore';
import {useEffect} from 'react';

export const useInitializeAuth = () => {
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);
};
