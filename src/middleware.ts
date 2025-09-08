// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Désactivons temporairement toute redirection pour debug
  console.log("Middleware executing for path:", request.nextUrl.pathname);
  console.log("Cookies:", request.cookies.getAll().map(c => `${c.name}=${c.value}`).join('; '));
  
  // Pour fins de débogug, n'effectuons aucune redirection
  return NextResponse.next();
}

// Le middleware ne doit s'exécuter que sur les pages de téléphone
export const config = {
  matcher: [
    '/dashboard/phone/:path*',
  ],
};