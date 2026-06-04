import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
} from "@/lib/session-token";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json().catch(() => ({
    username: "",
    password: "",
  }));

  const normalizedUsername = String(username || "").trim().toLowerCase();
  const submittedPassword = String(password || "");

  if (!normalizedUsername || !submittedPassword) {
    return NextResponse.json(
      { success: false, message: "Username and password are required." },
      { status: 400 },
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { username: normalizedUsername },
  });

  if (!admin || !verifyPassword(submittedPassword, admin.passwordHash)) {
    return NextResponse.json(
      { success: false, message: "Invalid admin credentials." },
      { status: 401 },
    );
  }

  const token = await createAdminSessionToken({
    adminId: admin.id.toString(),
    username: admin.username,
  });
  const response = NextResponse.json({ success: true });

  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
