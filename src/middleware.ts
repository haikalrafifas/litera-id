import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import JWTAuth from './utilities/server/jwt';

// Middleware runs before the page is rendered
export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const token = request.cookies.get('token');
  const isAuthRoute = url.pathname.startsWith('/auth');
  const isAppRoute = url.pathname.startsWith('/app');

  const isTokenValid = token
    ? await JWTAuth.access.verify(token.value)
    : false;

  // If you're on an /auth/* route and the token exists, redirect to /app
  if (isAuthRoute && isTokenValid) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  // If you're on an /app/* route and no valid token exists, redirect to /auth/login
  if (isAppRoute && !isTokenValid) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // No redirection needed for other routes
  return NextResponse.next();
}

// Define the paths where the middleware should run
export const config = {
  matcher: ['/auth/:path*', '/app/:path*', '/'],
};
