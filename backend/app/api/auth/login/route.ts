// import bcrypt from "bcryptjs";
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// import { json } from "@/lib/api-helpers";
// import { signToken } from "@/lib/auth";
// import { corsPreflight, withCors } from "@/lib/cors";
// import { prisma } from "@/lib/prisma";

// export function OPTIONS(request: NextRequest) {
//   return corsPreflight(request);
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const email = String(body.email ?? "").trim();
//     const password = String(body.password ?? "");

//     if (!email || !password) {
//       return json({ error: "Email and password are required" }, { status: 400 });
//     }

//     const user = await prisma.adminUser.findUnique({ where: { email } });
//     if (!user) {
//       return json({ error: "Invalid credentials" }, { status: 401 });
//     }

//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid) {
//       return json({ error: "Invalid credentials" }, { status: 401 });
//     }

//     const token = await signToken({ sub: user.id, email: user.email });
//     const response = withCors(
//       NextResponse.json({ success: true, token }),
//       request,
//     );

//     response.cookies.set("admin-token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       maxAge: 7 * 24 * 60 * 60,
//       path: "/",
//     });

//     return response;
//   } catch {
//     return json({ error: "Login failed" }, { status: 500 });
//   }
// }
import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { json } from "@/lib/api-helpers";
import { signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ sub: user.id, email: user.email });
    const response = NextResponse.json({ success: true, token });

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch {
    return json({ error: "Login failed" }, { status: 500 });
  }
}