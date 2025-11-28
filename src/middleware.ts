import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the current path is an auth route
  const isAuthRoute = ["/signin", "/signup"].some((route) =>
    pathname.startsWith(route),
  );

  const session = request.cookies.get("authjs.session-token")?.value;

  // If accessing auth routes while already authenticated, redirect to root route
  if (isAuthRoute && session) {
    try {
      const verifyUrl = new URL("/api/auth/verify", request.url);
      verifyUrl.searchParams.set("sessionToken", session);

      const response = await fetch(verifyUrl.toString(), {
        method: "GET",
        headers: {
          "x-middleware-verify": "true",
        },
      });

      const data = (await response.json()) as { valid: boolean; role?: string };

      if (response.ok && data.valid) {
        // Valid session exists, redirect to callback URL or root route
        const callbackUrl = request.cookies.get("authjs.callback-url")?.value;
        const redirectUrl = new URL(callbackUrl ?? "/", request.url);
        const response = NextResponse.redirect(redirectUrl);
        // Clear the callback URL cookie after using it
        response.cookies.delete("authjs.callback-url");
        return response;
      }

      if (!response.ok || !data.valid) {
        // Removes session cookie if invalid, except on server errors, and then continue to auth page
        if (response.status !== 500)
          request.cookies.delete("authjs.session-token");

        return NextResponse.next();
      }
    } catch (error) {
      console.error("Session verification failed:", error);
      // Continue to auth page on error
      return NextResponse.next();
    }
  }

  // If no session cookie, allow access to auth routes
  if (isAuthRoute) return NextResponse.next();

  // If accessing a protected route
  if (!session) {
    // No session cookie, redirect to signin with callback URL in cookie
    const signInUrl = new URL("/signin", request.url);
    const response = NextResponse.redirect(signInUrl);
    // Set callback URL in cookie instead of query param
    response.cookies.set("authjs.callback-url", pathname, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return response;
  }

  // Verify session token with database via API route
  try {
    const verifyUrl = new URL("/api/auth/verify", request.url);
    verifyUrl.searchParams.set("sessionToken", session);

    const response = await fetch(verifyUrl.toString(), {
      method: "GET",
      headers: {
        "x-middleware-verify": "true",
      },
    });

    const data = (await response.json()) as { valid: boolean; role?: string };

    if (!response.ok || !data.valid) {
      // Session is invalid or expired, remove the invalid session cookie and redirect to signin
      const signInUrl = new URL("/signin", request.url);
      const redirectResponse = NextResponse.redirect(signInUrl);
      // Remove invalid session token
      redirectResponse.cookies.delete("authjs.session-token");
      // Set callback URL in cookie
      redirectResponse.cookies.set("authjs.callback-url", pathname, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      return redirectResponse;
    }

    // Check role-based access for specific routes
    if (pathname === "/my-rentals/new" && data.role !== "business") {
      // Non-business users cannot access this route
      return NextResponse.redirect(new URL("/my-rentals", request.url));
    }
  } catch (error) {
    console.error("Session verification failed:", error);
    // On error, redirect to signin to be safe
    // Also, does not remove session cookie here to allow retry
    const signInUrl = new URL("/signin", request.url);
    const redirectResponse = NextResponse.redirect(signInUrl);
    redirectResponse.cookies.set("authjs.callback-url", pathname, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return redirectResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected Routes
    "/",
    "/business/:path*",
    "/my-rentals/:path*",
    "/rentals/:path*",

    // Auth Routes
    "/signin/:path*",
    "/signup/:path*",
  ],
};
