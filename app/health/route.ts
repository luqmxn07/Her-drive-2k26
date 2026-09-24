import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "herdrive-backend",
    timestamp: new Date().toISOString(),
  });
}
