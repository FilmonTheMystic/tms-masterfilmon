import { NextRequest, NextResponse } from 'next/server';

const ADMIN_DOMAIN = 'admintms.masterfilmon.com';
const MAIN_DOMAIN = 'tms.masterfilmon.com';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Handle admin domain routing
  if (hostname === ADMIN_DOMAIN || hostname.includes('admin')) {
    // If on admin domain but not accessing admin routes, redirect to /admin/login
    if (!pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    // If accessing /admin root, redirect to /admin/login for proper authentication flow
    if (pathname === '/admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }
  
  // Handle main domain routing  
  if (hostname === MAIN_DOMAIN || (!hostname.includes('admin') && hostname !== '')) {
    // If on main domain but accessing admin routes, redirect to admin domain
    if (pathname.startsWith('/admin')) {
      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || `https://${ADMIN_DOMAIN}`;
      return NextResponse.redirect(`${adminUrl}${pathname}`);
    }
  }
  
  // Development environment handling
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Allow all routes in development
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
