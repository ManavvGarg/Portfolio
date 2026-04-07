import { NextRequest, NextResponse } from "next/server";

const REPO = "manavvgarg/portfolio";
const FILE_PATH = "data/portfolio.json";
const BRANCH = "main";

function isAuthorized(request: NextRequest): boolean {
  const password = request.headers.get("x-admin-password");
  return !!process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD;
}

function githubHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function getFile() {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
    { headers: githubHeaders(), cache: "no-store" }
  );
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`);
  return res.json();
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const file = await getFile();
    const content = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
    return NextResponse.json(content);
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
    const file = await getFile();
    const newContent = Buffer.from(JSON.stringify(body, null, 2), "utf8").toString("base64");

    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers: githubHeaders(),
        body: JSON.stringify({
          message: "Update portfolio data via admin dashboard",
          content: newContent,
          sha: file.sha,
          branch: BRANCH,
        }),
      }
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || `GitHub PUT failed: ${res.status}`);
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to save portfolio data:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save data" },
      { status: 500 }
    );
  }
}
