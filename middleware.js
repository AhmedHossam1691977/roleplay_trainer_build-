import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // الصفحات العامة اللي ممكن أي حد يدخلها
  const publicRoutes = [
    '/login',
    '/forgetPassword',
    '/verifyResetCode',
    '/resetPassword',
  ];

  // صفحات خاصة بالـ admin فقط
  const adminRoutes = [
    '/users',
    '/session',
    '/evaluation'
  ];

  // السماح بملفات Next.js الداخلية، ملفات API، والملفات الثابتة
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // قراءة cookie المستخدم
  const userCookie = request.cookies.get('user')?.value;
  let role;

  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      role = user.role; // هنا نجيب الدور من JSON
    } catch (err) {
      console.log("Invalid user cookie");
    }
  }

  // لو مش عامل login وحاول يدخل صفحة عامة مش مسموح بها
  if (!userCookie && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // لو عامل login وحاول يدخل صفحة login أو صفحات عامة
  if (userCookie && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // حماية صفحات الـ admin
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // السماح بالوصول للصفحات الأخرى
  return NextResponse.next();
}
