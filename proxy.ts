import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export function proxy(req: import("next/server").NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/users/:path*",
    "/dashboard/admin/:path*",
    "/api/user/:path*",
    "/api/admin/:path*",
  ],
};

export default withAuth(
  async function middleware(req) {
    const url = req.nextUrl.pathname;
    const token = req.nextauth?.token;

    const userRole = (token?.user as any)?.role;
    const isAdmin = ((token?.user as any)?.isAdmin as boolean) || (userRole === "admin");

    console.log('[Proxy] Path:', url, 'isAdmin:', isAdmin, 'hasToken:', !!token);

    // Don't redirect API routes - let them handle auth
    if (url?.startsWith("/api/")) {
      return NextResponse.next();
    }

    // Check admin access
    if (url?.includes("/admin")) {
      if (!isAdmin) {
        console.log('[Proxy] Blocking non-admin access to:', url);
        const callbackUrl = encodeURIComponent(req.url);
        return NextResponse.redirect(new URL(`/?error=unauthorized&callbackUrl=${callbackUrl}`, req.url));
      }
      console.log('[Proxy] Allowing admin access to:', url);
    }

    // Check regular user access
    if (url?.includes("/dashboard/users") && !token) {
      const callbackUrl = encodeURIComponent(req.url);
      return NextResponse.redirect(new URL(`/?callbackUrl=${callbackUrl}`, req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const url = req.nextUrl.pathname;

        console.log('[Proxy Auth] Checking:', url, 'hasToken:', !!token);

        // If no token, deny access
        if (!token) {
          console.log('[Proxy Auth] No token, denying access');
          return false;
        }

        // For admin routes, check if user is admin
        if (url?.includes("/admin")) {
          const isAdmin = ((token?.user as any)?.isAdmin as boolean) || ((token?.user as any)?.role as string) === "admin";
          console.log('[Proxy Auth] Admin check:', isAdmin);
          return isAdmin;
        }

        // For other protected routes, just check if logged in
        return true;
      },
    },
    pages: {
      signIn: "/", // Redirect unauthorized users to home page
    },
  }
);