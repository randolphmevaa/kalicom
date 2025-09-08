// File: lib/auth-utils.ts
import { cookies } from 'next/headers';

/**
 * Checks if the access token is expired
 */
export const isTokenExpired = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const expiresAtStr = cookieStore.get('keyyo_token_expires_at')?.value;
  
  if (!expiresAtStr) return true;
  
  const expiresAt = parseInt(expiresAtStr, 10);
  // Consider token expired 10 seconds before actual expiration
  // to avoid edge cases
  return Date.now() > expiresAt - 10000;
};

/**
 * Gets the access token from cookies
 */
export const getAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get('keyyo_access_token')?.value || null;
};

/**
 * Gets the refresh token from cookies
 */
export const getRefreshToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get('keyyo_refresh_token')?.value || null;
};

/**
 * Checks if the user is authenticated with Keyyo
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();
  
  return !!accessToken && !!refreshToken;
};

/**
 * For server components: Formats a phone number into international format
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Format the number as international format if needed
  if (!phoneNumber.startsWith('33') && phoneNumber.startsWith('0')) {
    return '33' + phoneNumber.substring(1);
  }
  return phoneNumber;
};