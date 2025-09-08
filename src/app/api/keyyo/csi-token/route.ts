// File: app/api/keyyo/csi-token/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Utility function to check if token is expired
const isTokenExpired = (expiresAtStr: string | undefined): boolean => {
  if (!expiresAtStr) return true;
  
  const expiresAt = parseInt(expiresAtStr, 10);
  // Consider token expired 10 seconds before actual expiration
  // to avoid edge cases
  return Date.now() > expiresAt - 10000;
};

// Utility function to refresh the token
const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
  try {
    const tokenUrl = 'https://api.keyyo.com/oauth2/token.php';
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.KEYYO_CLIENT_ID!,
      client_secret: process.env.KEYYO_CLIENT_SECRET!,
      redirect_uri: process.env.KEYYO_REDIRECT_URI!,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

export async function POST() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('keyyo_access_token')?.value;
  const refreshToken = cookieStore.get('keyyo_refresh_token')?.value;
  const expiresAt = cookieStore.get('keyyo_token_expires_at')?.value;

  // Check if token exists and if it's expired
  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { error: 'Not authenticated with Keyyo' },
      { status: 401 }
    );
  }

  // If token is expired, try to refresh it
  if (isTokenExpired(expiresAt)) {
    const newAccessToken = await refreshAccessToken(refreshToken);
    if (!newAccessToken) {
      return NextResponse.json(
        { error: 'Authentication expired, please log in again' },
        { status: 401 }
      );
    }
    accessToken = newAccessToken;
  }

  try {
    // Get user info to retrieve CSI
    const userResponse = await fetch('https://api.keyyo.com/users/current.json', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      if (userResponse.status === 401) {
        return NextResponse.json(
          { error: 'Access token expired, please re-authenticate' },
          { status: 401 }
        );
      }
      throw new Error(`Failed to get user info: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    if (!userData.csi) {
      return NextResponse.json(
        { error: 'Failed to retrieve CSI from Keyyo' },
        { status: 500 }
      );
    }

    const csi = userData.csi;

    // Now get the CSI token
    const csiTokenResponse = await fetch('https://api.keyyo.com/cti/token.json', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!csiTokenResponse.ok) {
      throw new Error(`Failed to get CSI token: ${csiTokenResponse.statusText}`);
    }

    const csiTokenData = await csiTokenResponse.json();

    // Return both CSI token and CSI
    return NextResponse.json({
      csiToken: csiTokenData.token,
      csi: csi,
    });
  } catch (error) {
    console.error('Error getting CSI token:', error);
    return NextResponse.json(
      { error: 'Failed to get CSI token' },
      { status: 500 }
    );
  }
}