// src/app/api/auth/callback/keyyo/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  // const state = searchParams.get('state');
  
  console.log("Callback route called with code:", code?.substring(0, 5) + "...");
  
  if (!code) {
    return NextResponse.json(
      { error: 'Authorization code is missing' },
      { status: 400 }
    );
  }

  try {
    // Prepare token exchange request
    const tokenUrl = 'https://api.keyyo.com/oauth2/token.php';
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.KEYYO_CLIENT_ID!,
      client_secret: process.env.KEYYO_CLIENT_SECRET!,
      redirect_uri: process.env.KEYYO_REDIRECT_URI!,
    });

    console.log("Exchanging code for token with redirect URI:", process.env.KEYYO_REDIRECT_URI);

    // Exchange code for tokens
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange error:', errorData);
      return NextResponse.json(
        { error: 'Failed to exchange code for tokens' },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    console.log("Token obtained successfully! Setting cookies...");

    // Set secure cookies
    const cookieStore = await cookies();
    cookieStore.set('keyyo_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expires_in,
      sameSite: 'lax',
      path: '/',
    });

    cookieStore.set('keyyo_refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: 'lax',
      path: '/',
    });

    // Store token expiration time
    const expiresAt = Date.now() + expires_in * 1000;
    cookieStore.set('keyyo_token_expires_at', expiresAt.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expires_in,
      sameSite: 'lax',
      path: '/',
    });

    console.log("Cookies set, redirecting to /dashboard/phone");

    // Redirect to the dashboard
    return NextResponse.redirect(new URL('/dashboard/phone', request.url));
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with Keyyo' },
      { status: 500 }
    );
  }
}