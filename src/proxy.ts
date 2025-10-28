import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const verifyToken = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/auth/middleware-verify-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    if (!response.ok) throw new Error("Token verification failed");

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      throw new Error("Response was not JSON");
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublicPath = ["/"].includes(pathname);
  const token = req.cookies.get("token")?.value || "";
  const isLoggedIn = !!token;

  if (!isLoggedIn && !isPublicPath) {
    console.log("Not logged in, redirecting to login");
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  if (isLoggedIn) {
    const user = await verifyToken(token);

    if (!user) {
      console.log("Invalid token, redirecting to login");
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }

    const { role } = user.data;
    const dashboardPath = `/${role}/dashboard`;

    if (isPublicPath) {
      return NextResponse.redirect(new URL(dashboardPath, req.nextUrl.origin));
    }
  }
}

export const config = {
  matcher: ["/", "/user/:path*"],
};
