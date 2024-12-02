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

export type CookieGetter = () => {
  get: (name: string) => {value: string} | undefined;
};

export type CookieSetter = () => {
  set: (
    name: string,
    value: string,
    options?: {
      path?: string;
      maxAge?: number;
      domain?: string;
      httpOnly?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    },
  ) => void;
};

interface AuthState {
  isAuthenticated: boolean | null;
  authToken: string | null;
  decodedToken: PsFoodbookJWTPayload | null;
}

interface TokenValidationResult {
  isValid: boolean;
  payload: PsFoodbookJWTPayload | null;
  error?: string;
}

const TOKEN_ISSUER = 'Token.WebApp.Clients';
const TOKEN_AUDIENCE = 'Token.WebApp';

class AuthStateManager {
  private static instance: AuthStateManager;
  private cookieGetter: CookieGetter | null = null;
  private cookieSetter: CookieSetter | null = null;
  private state: AuthState = {
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

  setCookieGetter(getter: CookieGetter) {
    this.cookieGetter = getter;
  }

  setCookieSetter(setter: CookieSetter) {
    this.cookieSetter = setter;
  }

  getState(): AuthState {
    return this.state;
  }

  private setState(newState: Partial<AuthState>) {
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
    if (!this.cookieGetter) {
      this.setState({
        isAuthenticated: false,
        authToken: null,
        decodedToken: null,
      });
      return;
    }

    const cookieStore = this.cookieGetter();
    const cookieName = getPsFoodbookTokenCookieName();
    const psAuthCookie = cookieStore.get(cookieName);

    if (!psAuthCookie?.value) {
      this.setState({
        isAuthenticated: false,
        authToken: null,
        decodedToken: null,
      });
      return;
    }

    const {isValid, payload, error} = await this.validateToken(
      psAuthCookie.value,
    );
    if (!isValid) {
      console.warn('Token validation failed:', error);
    }

    this.setState({
      isAuthenticated: isValid,
      authToken: isValid ? psAuthCookie.value : null,
      decodedToken: payload,
    });
  }

  hasRole(role: string): boolean {
    return this.state.decodedToken?.role?.includes(role) ?? false;
  }
}

export function initializeCookieGetter(getter: CookieGetter): void {
  AuthStateManager.getInstance().setCookieGetter(getter);
}

export function initializeCookieSetter(setter: CookieSetter): void {
  AuthStateManager.getInstance().setCookieSetter(setter);
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

  const hostname = window.location.hostname;

  const response = await fetch('/api/setReturnUrl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({hostname}),
  });

  const data = await response.json();
  return data.success;

  // try {
  //   const response = await fetch('/api/setReturnUrl', {
  //     method: 'POST',
  //     headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify({returnUrl: window.location.href}),
  //   });

  //   const data = await response.json();
  //   return data.success;
  // } catch (error) {
  //   console.error('Error setting return URL cookie:', error);
  //   return false;
  // }
};

export const initializeReturnUrl = (): void => {
  setReturnUrlCookie().catch(console.error);
};
