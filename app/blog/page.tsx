import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-6">Blog</h1>

      {posts.length === 0 && (
        <p className="text-xs md:text-sm text-gray-500">No posts yet.</p>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block border border-black dark:border-white p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <h2 className="text-sm md:text-base font-bold mb-1">
              {post.title}
            </h2>
            <p className="text-xs text-gray-500 mb-2">{post.date}</p>
            {post.description && (
              <p className="text-xs md:text-sm">{post.description}</p>
            )}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
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
          </Link>
        ))}
      </div>
    </div>
  );
}
