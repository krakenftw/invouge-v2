import { db } from "@/db";
import { visitors } from "@/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, botId } = await request.json();
  if (!name || !email || !botId) {
    return NextResponse.json({
      status: 300,
      error: "All fields required."
    });
  }
  await db.insert(visitors).values({ name, email, botId });
  return NextResponse.json({ status: 200 });
}
