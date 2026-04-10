import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function isVideoSrc(src: string): boolean {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(src);
}

export default function BlogContent({ content }: { content: string }) {
  return (
    <div className="blog-prose text-xs md:text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => {
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

            return (
              <Image
                src={src}
                alt={alt || ""}
                width={800}
                height={450}
                className="w-full h-auto my-4 border border-black dark:border-white"
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
