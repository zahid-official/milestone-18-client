import { NextRequest, NextResponse } from "next/server";
import { deleteCookies, getCookies } from "./services/auth/cookies";
import { UserRole } from "./types";
import envVars from "./config/envVars";
import { jwt } from "./import";
import { JwtPayload } from "jsonwebtoken";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute } from "./routes";
import { userRole } from "./constants/userRole";

// Proxy to guard routes by auth state and user role
export const proxy = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const accessToken = await getCookies("accessToken");

  // If we have a token, verify it and cache the role; clear bad tokens and force re-login
  let loggedUserRole: UserRole | null = null;
  if (accessToken) {
    const verifiedToken: JwtPayload | string = jwt.verify(
      accessToken,
      envVars.JWT.ACCESS_TOKEN_SECRET
    );
    if (typeof verifiedToken === "string") {
      await deleteCookies("accessToken");
      await deleteCookies("refreshToken");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    loggedUserRole = verifiedToken?.role;
  }

  const routeOwner = getRouteOwner(pathname);
  const authRoute = isAuthRoute(pathname);


  // Rule-1 : (Public Route) If authenticated user hitting login/register, redirect to their default dashboard
  if (accessToken && authRoute) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(loggedUserRole as UserRole), request.url)
    );
  }

  //  Rule-2: (Public Route) If unauthenticated user tries to access public route, allow access
  if (routeOwner === null) {
    return NextResponse.next();
  }

  // Rule-3: (Protected Route) If unauthenticated user tries to access protected route, redirect to login with original path & bounce back after login
  if (!accessToken) {
    const loginURL = new URL("/login", request.url);
    loginURL.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginURL);
  }

  // Rule-4 : (Protected Route) If authenticated user tries to access a common protected route, allow access
  if (routeOwner === "COMMON") {
    return NextResponse.next();
  }

  // Rule-5 : (Protected Route) If authenticated user tries to access a role-specific protected route, redirect to their default dashboard
  if (
    routeOwner === userRole.ADMIN ||
    routeOwner === userRole.VENDOR ||
    routeOwner === userRole.CUSTOMER
  ) {
    if (loggedUserRole !== routeOwner) {
      return NextResponse.redirect(
        new URL(
          getDefaultDashboardRoute(loggedUserRole as UserRole),
          request.url
        )
      );
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
