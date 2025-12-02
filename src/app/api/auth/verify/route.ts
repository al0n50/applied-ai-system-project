import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { sessions } from "~/server/db/schema/auth";
import { eq, and, gt } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.nextUrl.searchParams.get("sessionToken");

    if (!sessionToken) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // Check if session exists in the database and is not expired
    const userSession = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.sessionToken, sessionToken),
        gt(sessions.expires, new Date()),
      ),
      with: {
        user: true,
      },
    });

    if (!userSession) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json(
      { valid: true, role: userSession.user.role },
      { status: 200 },
    );
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
