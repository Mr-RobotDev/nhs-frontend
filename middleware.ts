import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token") || '';
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login'

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard/floor', request.url));
  }

  if (!isPublicPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    loginUrl.searchParams.set('authenticated', 'false');
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
