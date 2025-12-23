import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware executed'); // Debugging statement

  // Example: Fetch user from cookies or other source
  const user = request.cookies.get('user'); // Adjust based on your authentication logic

  if (!user) {
    console.log('User not found, redirecting'); // Debugging statement
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log('User found, proceeding to the page'); // Debugging statement
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/project'], // Apply middleware to these paths
};
