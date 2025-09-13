import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.pathname;

  if (url.startsWith('/dashboard/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (decodedToken.role !== 'admin') {
        // Redirige si el usuario no es admin
        return NextResponse.redirect(new URL('/dashboard/user', request.url));
      }
    } catch (error) {
      // Token inválido o expirado
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Permite el acceso a otras rutas
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/admin/:path*'], // Proteger solo las rutas de admin
};