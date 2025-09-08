// File: app/api/auth/refresh/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('keyyo_refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: 'No refresh token available' },
      { status: 401 }
    );
  }

  try {
    // Prepare token refresh request
    const tokenUrl = 'https://api.keyyo.com/oauth2/token.php';
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.KEYYO_CLIENT_ID!,
      client_secret: process.env.KEYYO_CLIENT_SECRET!,
      redirect_uri: process.env.KEYYO_REDIRECT_URI!,
    });

    // Get new access token
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token refresh error:', errorData);
      
      // If refresh token is invalid, clear all auth cookies
      if (errorData.error === 'invalid_grant') {
        cookieStore.delete('keyyo_access_token');
        cookieStore.delete('keyyo_refresh_token');
        cookieStore.delete('keyyo_token_expires_at');
        
        return NextResponse.json(
          { error: 'Invalid refresh token, please log in again' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to refresh token' },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, expires_in } = tokenData;

    // Set new access token cookie
    cookieStore.set('keyyo_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expires_in,
      sameSite: 'lax',
      path: '/',
    });

    // Update expiration time
    const expiresAt = Date.now() + expires_in * 1000;
    cookieStore.set('keyyo_token_expires_at', expiresAt.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expires_in,
      sameSite: 'lax',
      path: '/',
    });

    // If a new refresh token is provided, update it as well
    if (tokenData.refresh_token) {
      cookieStore.set('keyyo_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        sameSite: 'lax',
        path: '/',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}