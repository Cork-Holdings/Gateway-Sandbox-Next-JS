import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    if (!token && pathname.startsWith("/admin")) {
      const loginUrl = new URL("/auth/signin/admin", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      const unauthorizedUrl = new URL("/403", req.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    if (!token && pathname.startsWith("/merchant")) {
      const loginUrl = new URL("/auth/signin/merchant", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/merchant") && token?.role !== "merchant") {
      const unauthorizedUrl = new URL("/403", req.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
    pages: {
      signIn: "/auth/signin/merchant",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/merchant/:path*",
  ],
};
