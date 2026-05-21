import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("user_role")?.value;

  const isAuthPath = pathname === "/login" || pathname === "/register";
  const isDashboardPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/artists");
  const isArtistPath = pathname === "/artist";

  
  if (!token && isDashboardPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }


  if (!token && isArtistPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  
  if (token && role === "artist" && isDashboardPath) {
    return NextResponse.redirect(new URL("/artist", request.url));  // ✅ changed
  }

  
  if (token && role !== "artist" && isArtistPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  
  if (token && role !== "artist" && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

 
  if (token && role === "artist" && isAuthPath) {
    return NextResponse.redirect(new URL("/artist", request.url));  // ✅ added
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/users/:path*",
    "/artists/:path*",
    "/artist",  
  ],
};