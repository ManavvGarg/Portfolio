import Link from "next/link";
import { getAllPostSlugs, getPost } from "@/lib/blog";
import BlogContent from "@/components/BlogContent";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return {
    title: `${post.title} — Manav Garg`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  return (
    <article>
      <Link
        href="/blog"
        className="text-xs hover:underline inline-block mb-6"
      >
        ← Back to blog
      </Link>

      <header className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold mb-2">{post.title}</h1>
        <p className="text-xs text-gray-500">{post.date}</p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] border border-black dark:border-white px-1.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <BlogContent content={post.content} />
    </article>
  );
}
