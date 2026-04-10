import { NextRequest, NextResponse } from "next/server";

const REPO = "manavvgarg/portfolio";
const FILE_PATH = "public/profile_picture_manav_garg.jpeg";
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

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("profileImage") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine file extension from uploaded file
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpeg";
    const allowedExts = ["jpg", "jpeg", "png", "webp"];
    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    const targetPath = `public/profile_picture_manav_garg.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const base64Content = Buffer.from(arrayBuffer).toString("base64");

    // If extension changed, delete old file first
    if (targetPath !== FILE_PATH) {
      const oldRes = await fetch(
        `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
        { headers: githubHeaders(), cache: "no-store" }
      );
      if (oldRes.ok) {
        const oldFile = await oldRes.json();
        await fetch(
          `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
          {
            method: "DELETE",
            headers: githubHeaders(),
            body: JSON.stringify({
              message: "Remove old profile image via admin dashboard",
              sha: oldFile.sha,
              branch: BRANCH,
            }),
          }
        );
      }
    }

    // Check if target file already exists to get its SHA
    let sha: string | undefined;
    const existingRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${targetPath}?ref=${BRANCH}`,
      { headers: githubHeaders(), cache: "no-store" }
    );
    if (existingRes.ok) {
      const existing = await existingRes.json();
      sha = existing.sha;
    }

    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${targetPath}`,
      {
        method: "PUT",
        headers: githubHeaders(),
        body: JSON.stringify({
          message: "Update profile image via admin dashboard",
          content: base64Content,
          ...(sha ? { sha } : {}),
          branch: BRANCH,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || `GitHub PUT failed: ${res.status}`);
    }

    return NextResponse.json({
      success: true,
      path: `/profile_picture_manav_garg.${ext}`,
    });
  } catch (e) {
    console.error("Failed to upload profile image:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to upload profile image" },
      { status: 500 }
    );
  }
}
