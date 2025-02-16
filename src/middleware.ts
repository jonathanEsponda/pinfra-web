import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  console.log("session: ", session);

  const publicPaths = ["/login", "/registro", "/"];

  // Si la ruta es pública, continúa sin validar
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
// // See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/equipos/:path*",
    "/perfil/modificar",
    "/usuarios/:path*",
    "/tiposequipos/:path*",
  ],
};
