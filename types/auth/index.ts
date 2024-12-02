export type AuthResponse = {
  isAuthenticated: boolean;
  displayName?: string;
  token?: string | null;
  role?: string[];
};
