import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";

const REPO = "manavvgarg/portfolio";
const BRANCH = "main";
const BLOG_DIR = "content/blog";

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

// GET — list all posts, or fetch a single post by ?slug=
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = request.nextUrl.searchParams.get("slug");

  try {
    if (slug) {
      // Fetch single post and parse frontmatter
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/contents/${BLOG_DIR}/${slug}.md?ref=${BRANCH}`,
        { headers: githubHeaders(), cache: "no-store" }
      );
      if (!res.ok) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      const file = await res.json();
      const raw = Buffer.from(file.content, "base64").toString("utf8");
      const { data, content } = matter(raw);

      return NextResponse.json({
        slug,
        title: data.title || "",
        date: data.date || "",
        description: data.description || "",
        tags: data.tags || [],
        content,
        sha: file.sha,
      });
    }

    // List all posts (just slugs — fast, single API call)
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${BLOG_DIR}?ref=${BRANCH}`,
      { headers: githubHeaders(), cache: "no-store" }
    );
    if (!res.ok) {
      if (res.status === 404) return NextResponse.json([]);
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const files = await res.json();
    if (!Array.isArray(files)) return NextResponse.json([]);

    const posts = files
      .filter((f: { name: string }) => f.name.endsWith(".md"))
      .map((f: { name: string }) => f.name.replace(/\.md$/, ""));

    return NextResponse.json(posts);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// PUT — create or update a post
export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, date, description, tags, content } = body;

    if (!slug || content == null) {
      return NextResponse.json(
        { error: "slug and content are required" },
        { status: 400 }
      );
    }

    // Build the markdown file with frontmatter
    const tagsArray: string[] = Array.isArray(tags) ? tags : [];
    const frontmatter = [
      "---",
      `title: "${(title || "").replace(/"/g, '\\"')}"`,
      `date: "${date || ""}"`,
      `description: "${(description || "").replace(/"/g, '\\"')}"`,
      `tags: [${tagsArray.map((t: string) => `"${t.replace(/"/g, '\\"')}"`).join(", ")}]`,
      "---",
      "",
    ].join("\n");

    const fullContent = frontmatter + "\n" + content;
    const base64Content = Buffer.from(fullContent, "utf8").toString("base64");
    const filePath = `${BLOG_DIR}/${slug}.md`;

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
          message: sha
            ? `Update blog post: ${slug}`
            : `Create blog post: ${slug}`,
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

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save post" },
      { status: 500 }
    );
  }
}

// DELETE — delete a post
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json(
        { error: "slug is required" },
        { status: 400 }
      );
    }

    const filePath = `${BLOG_DIR}/${slug}.md`;

    const existingRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`,
      { headers: githubHeaders(), cache: "no-store" }
    );
    if (!existingRes.ok) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const existing = await existingRes.json();

    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${filePath}`,
      {
        method: "DELETE",
        headers: githubHeaders(),
        body: JSON.stringify({
          message: `Delete blog post: ${slug}`,
          sha: existing.sha,
          branch: BRANCH,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || `GitHub DELETE failed: ${res.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete post" },
      { status: 500 }
    );
  }
}
