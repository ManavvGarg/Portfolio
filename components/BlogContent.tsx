import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function isVideoSrc(src: string): boolean {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(src);
}

export default function BlogContent({ content }: { content: string }) {
  return (
    <div className="blog-prose text-xs md:text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ src, alt, width }) => {
            if (!src || typeof src !== "string") return null;

            if (isVideoSrc(src)) {
              return (
                <video
                  src={src}
                  controls
                  playsInline
                  className="w-full my-4 border border-black dark:border-white"
                >
                  {alt}
                </video>
              );
            }

            // Raw <img> with explicit width — honour it, use plain img tag
            if (width) {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={alt || ""}
                  style={{ width: width as string, height: "auto" }}
                  className="my-4 border border-black dark:border-white"
                />
              );
            }

            // Default markdown image — 50% width via Next.js Image
            return (
              <Image
                src={src}
                alt={alt || ""}
                width={800}
                height={450}
                className="w-1/2 h-auto my-4 border border-black dark:border-white"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
