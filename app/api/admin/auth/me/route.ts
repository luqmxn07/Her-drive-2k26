import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);

  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  return NextResponse.json(
    {
      success: true,
      user: authResult.user,
    },
    { status: 200 }
  );
}
