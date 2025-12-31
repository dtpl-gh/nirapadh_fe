import { NextResponse, NextRequest } from 'next/server';
import { hasAccess, PredefinedRole } from './app/lib/rbac';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedPath = pathname.startsWith('/conversations') || pathname.startsWith('/dashboard');

  if (isProtectedPath) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));

    try {
      const decoded = jose.decodeJwt(token);
      let role = (decoded.scope as string) || (decoded.role as string) || (decoded.authorities as string[])?.[0] || PredefinedRole.ROLE_CLIENT;


      if (!hasAccess(role, pathname)) {
        return NextResponse.rewrite(new URL('/unauthorized', request.url));
      }
    } catch (e) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
