import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { UserRole } from "@/types/roles";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!req.auth?.user) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  if (pathname.startsWith("/admin")) {
    if (req.auth.role !== UserRole.ADMIN && req.auth.role !== UserRole.STAFF) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
