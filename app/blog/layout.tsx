import type React from "react";
import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blog — Manav Garg",
  description: "Thoughts on ML, software engineering, and more.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen flex flex-col ${ibmPlexMono.className}`}>
      <nav className="flex justify-center items-center py-3 md:py-4 px-2">
        <div className="flex items-center space-x-4 md:space-x-8 text-xs md:text-sm">
          <Link href="/" className="uppercase hover:underline">
            home
          </Link>
          <Link href="/blog" className="uppercase hover:underline">
            blog
          </Link>
          <div className="ml-1 md:ml-2 flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-6 pb-12">
        {children}
      </main>
      <footer className="py-2 text-center text-xs">
        © {new Date().getFullYear()} | Manav Garg
      </footer>
    </div>
  );
}
