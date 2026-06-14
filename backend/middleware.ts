// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// import { corsPreflight, withCors } from "@/lib/cors";

// export async function middleware(request: NextRequest) {
//   if (request.method === "OPTIONS") {
//     return corsPreflight(request);
//   }
//   return withCors(NextResponse.next(), request);
// }

// export const config = {
//   matcher: ["/api/:path*"],
// };
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};