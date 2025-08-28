import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Server-only API: serves crossword data from a private file not exposed via /public
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "crosswords.json");
    const text = await fs.readFile(filePath, "utf8");
    // Validate minimal shape (optional lightweight safeguard)
    const json = JSON.parse(text);
    if (!Array.isArray(json)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 500 });
    }
    return new NextResponse(JSON.stringify(json), {
      status: 200,
      headers: {
        "content-type": "application/json",
        // prevent caching on CDN/client; always fresh
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    console.error("Failed to load crosswords:", e);
    return NextResponse.json({ error: "Failed to load crosswords" }, { status: 500 });
  }
}
