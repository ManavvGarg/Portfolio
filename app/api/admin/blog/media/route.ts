import { NextRequest, NextResponse } from "next/server";

const REPO = "manavvgarg/portfolio";
const BRANCH = "main";
const MEDIA_DIR = "public/blog";

function isAuthorized(request: NextRequest): boolean {
  const password = request.headers.get("x-admin-password");
  return (
    !!process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD
  );
}

function githubHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// GET — list media files for a post (?slug=)
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json(
      { error: "slug is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${MEDIA_DIR}/${slug}?ref=${BRANCH}`,
      { headers: githubHeaders(), cache: "no-store" }
    );

    if (!res.ok) {
      if (res.status === 404) return NextResponse.json([]);
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const files = await res.json();
    if (!Array.isArray(files)) return NextResponse.json([]);

    const media = files.map((f: { name: string; size: number }) => ({
      name: f.name,
      path: `/blog/${slug}/${f.name}`,
      size: f.size,
    }));

    return NextResponse.json(media);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to list media" },
      { status: 500 }
    );
  }
}

// PUT — upload a media file (FormData: file + slug)
export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const slug = formData.get("slug") as string | null;

    if (!file || !slug) {
      return NextResponse.json(
        { error: "file and slug are required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Content = Buffer.from(arrayBuffer).toString("base64");
    const filePath = `${MEDIA_DIR}/${slug}/${file.name}`;

    // Check if file exists to get SHA
    let sha: string | undefined;
    const existingRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`,
      { headers: githubHeaders(), cache: "no-store" }
    );
    if (existingRes.ok) {
      const existing = await existingRes.json();
      sha = existing.sha;
    }

    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${filePath}`,
      {
        method: "PUT",
        headers: githubHeaders(),
        body: JSON.stringify({
          message: `Upload blog media: ${slug}/${file.name}`,
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
      name: file.name,
      path: `/blog/${slug}/${file.name}`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to upload media" },
      { status: 500 }
    );
  }
}
