import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "portfolio.json");

function isAuthorized(request: NextRequest): boolean {
  const password = request.headers.get("x-admin-password");
  return password === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const text = await fs.readFile(DATA_PATH, "utf8");
    return NextResponse.json(JSON.parse(text));
  } catch (e) {
    console.error("Failed to load portfolio data:", e);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    await fs.writeFile(DATA_PATH, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to save portfolio data:", e);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
