"use client";

import { IBM_Plex_Mono } from "next/font/google";
import Image from "next/image";
import {
  Book,
  Building2,
  Clock,
  Github,
  Instagram,
  Linkedin,
  MapPin,
} from "lucide-react";
import { useState } from "react";

import HomePage from "@/components/pages/HomePage";
import ProjectsPage from "@/components/pages/ProjectsPage";
import ContactPage from "@/components/pages/ContactPage";
import ResumePage from "@/components/pages/ResumePage";
import SpotifyNowPlaying from "@/components/SpotifyNowPlaying";
import { ThemeToggle } from "@/components/theme-toggle";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

type PageKey = "home" | "about" | "projects" | "contact" | "resume" | "blog";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PortfolioClient({ data }: { data: any }) {
  const [active, setActive] = useState<PageKey>("home");
  const s = data.sidebar;

  const renderActivePage = () => {
    switch (active) {
      case "home":
        return <HomePage data={data.about} />;
      case "projects":
        return <ProjectsPage data={data.projects} />;
      case "contact":
        return <ContactPage />;
      case "resume":
        return <ResumePage data={data.resume} />;
      default:
        return <HomePage data={data.about} />;
    }
  };

  const navItems: PageKey[] = ["home", "projects", "contact", "resume"];

  return (
    <div className={`flex flex-col min-h-screen ${ibmPlexMono.className}`}>
      <nav className="flex justify-center items-center py-3 md:py-4 overflow-x-auto px-2">
        <div className="flex items-center space-x-4 md:space-x-8 text-xs md:text-sm">
          {navItems.map((p) => (
            <button
              key={p}
              onClick={() => setActive(p)}
              className={`uppercase hover:underline whitespace-nowrap ${
                active === p ? "underline" : ""
              }`}
            >
              {p}
            </button>
          ))}
          <div className="ml-1 md:ml-2 flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center px-2 md:px-4 w-full overflow-hidden">
        <div className="w-full max-w-5xl mb-4">
          <div className="flex flex-col md:flex-row mb-4 layout-container">
            {/* Left column */}
            <div className="w-full md:w-1/3 pr-0 md:pr-4 mb-6 md:mb-0 content-left">
              <div className="relative mb-4">
                <div className="relative mb-4">
                  <div className="border border-black dark:border-white mx-auto md:mx-0 w-[210px] md:w-[390px] max-w-full">
                    <Image
                      src={`${s.profileImage}?height=176&width=176`}
                      alt="Profile"
                      width={390}
                      height={390}
                      className="w-full h-auto"
                      priority
                    />
                  </div>
                </div>
              </div>

              <h1
                className={`text-xl md:text-2xl ${ibmPlexMono.className} font-bold mb-1`}
              >
                {s.name}
              </h1>
              <div className="w-full h-px bg-black dark:bg-white mb-2"></div>

              <p className="text-xs mb-3 leading-relaxed">
                {s.titles.map((t: string, i: number) => (
                  <span key={i}>
                    {t}
                    {i < s.titles.length - 1 && <br />}
                  </span>
                ))}
              </p>
              <div className="w-full h-px bg-black dark:bg-white mb-2"></div>

              <p className="text-xs mb-4 leading-tight whitespace-pre-line">
                {s.bio}
              </p>

              <p
                className="text-xs italic mb-1 leading-tight whitespace-pre-line"
                style={{ color: "red" }}
              >
                &ldquo;{s.quote.text}&rdquo;
              </p>
              <p className="text-xs mb-4">— {s.quote.author}</p>
              <div className="w-full h-px bg-black dark:bg-white mb-2"></div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start text-xs">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{s.location}</span>
                </div>
                <div className="flex items-start text-xs">
                  <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="break-words">
                    {new Date().toLocaleTimeString("en-US", {
                      timeZone: "Asia/Kolkata",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    (IST) {" / "}
                    {new Date().toLocaleTimeString("en-US", {
                      timeZone: "UTC",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    (UTC)
                  </span>
                </div>
                <div className="flex items-start text-xs">
                  <Building2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <a
                      href={s.company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {s.company.name}
                    </a>
                  </span>
                </div>
                <div className="flex items-start text-xs">
                  <Github className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <a
                      href={s.social.github.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {s.social.github.label}
                    </a>
                  </span>
                </div>
                <div className="flex items-start text-xs">
                  <Linkedin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <a
                      href={s.social.linkedin.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {s.social.linkedin.label}
                    </a>
                  </span>
                </div>
              </div>
              <div className="w-full h-px bg-black dark:bg-white mb-2"></div>

              <div className="space-y-2">
                <div className="flex items-start text-xs">
                  <Book className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{s.currentlyReading}</span>
                </div>
                <div className="flex items-start text-xs">
                  <Instagram className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <a
                      href={s.social.designInstagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {s.social.designInstagram.label}
                    </a>
                  </span>
                </div>
                <div className="flex items-start text-xs">
                  <span>
                    <SpotifyNowPlaying />
                  </span>
                </div>
              </div>
              <div className="w-full h-px bg-black dark:bg-white mt-2"></div>
            </div>

            {/* Right Column */}
            <div
              className="w-full md:w-2/3 border border-black dark:border-white overflow-auto content-right"
              style={{ height: "auto" }}
            >
              <div
                className="border-b border-black dark:border-white overflow-auto custom-scrollbar"
                style={{ height: "auto", maxHeight: "665px" }}
              >
                {renderActivePage()}
              </div>
              <div className="border-t border-black dark:border-white p-3">
                <h3 className="text-sm font-semibold mb-3 text-left md:text-left text-center">
                  GitHub Activity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="hidden md:flex md:border md:border-black dark:md:border-white flex justify-center">
                    <Image
                      src={`https://github-readme-stats.vercel.app/api?username=${s.githubUsername}&show_icons=false&theme=swift&hide_title=true&include_all_commits=true&card_width=300&show=reviews,prs_merged,prs_merged_percentage`}
                      alt="GitHub Stats"
                      width={300}
                      height={110}
                      className="h-auto object-contain md:w-auto"
                    />
                  </div>
                  <div className="block md:hidden flex justify-center">
                    <Image
                      src={`https://github-readme-stats.vercel.app/api?username=${s.githubUsername}&show_icons=false&theme=swift&hide_title=true&include_all_commits=true&card_width=300&show=reviews,prs_merged,prs_merged_percentage`}
                      alt="GitHub Stats"
                      width={300}
                      height={101}
                      className="h-auto object-contain"
                    />
                  </div>
                  <div className="hidden md:flex md:border md:border-black dark:md:border-white flex justify-center">
                    <Image
                      src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${s.githubUsername}&hide=lua&theme=swift&layout=compact&card_width=303`}
                      alt="Most Used Languages"
                      width={300}
                      height={110}
                      className="h-auto object-contain md:w-auto"
                    />
                  </div>
                  <div className="block md:hidden flex justify-center">
                    <Image
                      src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${s.githubUsername}&hide=lua&theme=swift&layout=compact&card_width=303`}
                      alt="Most Used Languages"
                      width={300}
                      height={110}
                      className="h-auto object-contain"
                    />
                  </div>
                </div>
                <div className="text-xs text-center mt-2">
                  <a
                    href={s.social.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View full GitHub profile →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-2 text-center text-xs">
        © {new Date().getFullYear()} |{" "}
        <a
          href={s.social.github.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {s.name}
        </a>
      </footer>
    </div>
  );
}
