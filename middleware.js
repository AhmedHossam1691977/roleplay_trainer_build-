import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;


  const publicRoutes = [
    '/login',
    '/forgetPassword',
    '/verifyResetCode',
    '/resetPassword',
  ];


  const adminRoutes = [
    '/users',
"/session",
"/evaluation"
  ];


  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  const role  = request.cookies.get('role')?.value;

  /* مش عامل login */
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  /* عامل login و رايح auth */
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  /* حماية صفحات الـ Admin */
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}
