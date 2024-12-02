import useAuthStore from '@/stores/auth/authStore';
import {getPsFoodbookTokenCookieName} from '@/utils/helpers';
import {JWTPayload} from 'jose';

export interface PsFoodbookJWTPayload extends JWTPayload {
  username: string;
  displayname: string;
  userid: string;
  firstname: string;
  lastname: string;
  relationid: string;
  relationname: string;
  canpublish: string;
  canreceieve: string;
  role: string[];
}

export interface TokenValidationResult {
  isValid: boolean;
  payload: PsFoodbookJWTPayload | null;
  error?: string;
}

const TOKEN_ISSUER = 'Token.WebApp.Clients';
const TOKEN_AUDIENCE = 'Token.WebApp';

class AuthStateManager {
  private static instance: AuthStateManager;
  private state: {
    isAuthenticated: boolean | null;
    authToken: string | null;
    decodedToken: PsFoodbookJWTPayload | null;
  } = {
    isAuthenticated: null,
    authToken: null,
    decodedToken: null,
  };

  private constructor() {}

  static getInstance(): AuthStateManager {
    if (!AuthStateManager.instance) {
      AuthStateManager.instance = new AuthStateManager();
    }
    return AuthStateManager.instance;
  }

  getState() {
    return this.state;
  }

  private setState(newState: Partial<typeof this.state>) {
    this.state = {...this.state, ...newState};
  }

  async validateToken(token: string): Promise<TokenValidationResult> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return {isValid: false, payload: null, error: 'Invalid token format'};
      }

      let payload: PsFoodbookJWTPayload;
      try {
        payload = JSON.parse(
          Buffer.from(parts[1], 'base64').toString(),
        ) as PsFoodbookJWTPayload;
      } catch (e) {
        return {
          isValid: false,
          payload: null,
          error: 'Invalid token payload',
        };
      }

      const now = Math.floor(Date.now() / 1000);

      // Validation checks
      if (payload.exp && payload.exp < now) {
        return {isValid: false, payload: null, error: 'Token expired'};
      }
      if (payload.nbf && payload.nbf > now) {
        return {isValid: false, payload: null, error: 'Token not yet valid'};
      }
      if (payload.iss !== TOKEN_ISSUER) {
        return {isValid: false, payload: null, error: 'Invalid issuer'};
      }
      if (payload.aud !== TOKEN_AUDIENCE) {
        return {isValid: false, payload: null, error: 'Invalid audience'};
      }

      return {
        isValid: true,
        payload: payload,
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return {
        isValid: false,
        payload: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private validateRequiredFields(payload: PsFoodbookJWTPayload): boolean {
    const requiredFields: (keyof PsFoodbookJWTPayload)[] = [
      'username',
      'displayname',
      'userid',
      'relationid',
      'role',
    ];

    return requiredFields.every(field => {
      const value = payload[field];
      if (field === 'role') {
        return Array.isArray(value) && value.length > 0;
      }
      return typeof value === 'string' && value.length > 0;
    });
  }

  async initializeAuthStatus(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    const cookieName = getPsFoodbookTokenCookieName();
    const allCookies = document.cookie;

    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${cookieName}=`));

    if (!cookie) {
      this.setState({
        isAuthenticated: false,
        authToken: null,
        decodedToken: null,
      });
      useAuthStore.getState().setToken(null);
      return;
    }

    const token = cookie.split('=')[1];
    const validationResult = await this.validateToken(token);

    this.setState({
      isAuthenticated: validationResult.isValid,
      authToken: validationResult.isValid ? token : null,
      decodedToken: validationResult.payload,
    });

    // Store token in global store if valid
    useAuthStore.getState().setToken(validationResult.isValid ? token : null);
  }

  hasRole(role: string): boolean {
    return this.state.decodedToken?.role?.includes(role) ?? false;
  }
}

export async function validateToken(
  token: string,
): Promise<TokenValidationResult> {
  return AuthStateManager.getInstance().validateToken(token);
}

export async function initializeAuthStatus(): Promise<void> {
  return AuthStateManager.getInstance().initializeAuthStatus();
}

export function isPsAuthPresent(): boolean {
  return AuthStateManager.getInstance().getState().isAuthenticated ?? false;
}

export function getAuthToken(): string | null {
  return AuthStateManager.getInstance().getState().authToken;
}

export function getDecodedToken(): PsFoodbookJWTPayload | null {
  return AuthStateManager.getInstance().getState().decodedToken;
}

export async function checkAuthStatus(): Promise<{
  isAuthenticated: boolean;
  authToken: string | null;
}> {
  await AuthStateManager.getInstance().initializeAuthStatus();
  const state = AuthStateManager.getInstance().getState();

  return {
    isAuthenticated: state.isAuthenticated ?? false,
    authToken: state.authToken,
  };
}

export const setReturnUrlCookie = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  try {
    const response = await fetch('/api/setReturnUrl', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        returnUrl: window.location.href,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error setting return URL cookie:', error);
    return false;
  }
};

export const initializeReturnUrl = (): void => {
  setReturnUrlCookie().catch(console.error);
};

// Client-side auth check function
export const getClientAuthStatus = async () => {
  await AuthStateManager.getInstance().initializeAuthStatus();
  const state = AuthStateManager.getInstance().getState();

  return {
    isAuthenticated: state.isAuthenticated ?? false,
    userName: state.decodedToken?.displayname ?? null,
    token: state.authToken,
  };
};
