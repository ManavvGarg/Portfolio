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

// Import page components
import HomePage from "@/components/pages/HomePage";
import ProjectsPage from "@/components/pages/ProjectsPage";
import ContactPage from "@/components/pages/ContactPage";
import ResumePage from "@/components/pages/ResumePage";
import SpotifyNowPlaying from "@/components/SpotifyNowPlaying";

// Initialize the font
const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

type PageKey = "home" | "about" | "projects" | "contact" | "resume";

export default function Home() {
  const [active, setActive] = useState<PageKey>("home");

  // Render the appropriate component based on active page
  const renderActivePage = () => {
    switch (active) {
      case "home":
        return <HomePage />;
      case "projects":
        return <ProjectsPage />;
      case "contact":
        return <ContactPage />;
      case "resume":
        return <ResumePage />;
      default:
        return <HomePage />;
    }
  };

  const navItems: PageKey[] = ["home", "projects", "contact", "resume"];

  return (
    <div className={`flex flex-col min-h-screen ${ibmPlexMono.className}`}>
      {/* Navigation - centered, uppercase, underlined */}
      <nav className="flex justify-center items-center py-4">
        <div className="flex space-x-8 text-sm">
          {navItems.map((p) => (
            <button
              key={p}
              onClick={() => setActive(p)}
              className={`uppercase hover:underline ${
                active === p ? "underline" : ""
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      {/* <main className="flex-1 flex justify-center px-4"> */}
      <main className="flex-1 flex flex-col items-center px-4">
        <div className="max-w-5xl w-full mb-4">
          <div className="flex mb-4">
            {/* left column */}
            <div className="w-1/3 pr-4">
              {/* Profile Image with Status */}
              <div className="relative mb-4">
                <div className="border border-black dark:border-white">
                  <Image
                    src="/profile_picture_manav_garg.jpeg?height=176&width=176"
                    alt="Profile"
                    width={176}
                    height={176}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Name */}
              <h1
                className={`text-2xl ${ibmPlexMono.className} font-bold mb-1`}
              >
                Manav Garg
              </h1>
              <div className="w-full h-px bg-black dark:bg-white mb-2"></div>

              {/* Title - with pipe separators */}
              <p className="text-xs mb-3 leading-relaxed">
                Aspiring Machine Learning Engineer,<br />
                Data Science Enthusiast,<br />
                Research-Oriented Developer<br />
              </p>
              <div className="w-full h-px bg-black dark:bg-white mb-2"></div>

              {/* Bio */}
              <p className="text-xs mb-4 leading-tight">
                Motivated by curiosity and driven by data —<br />
                I combine code, creativity, and critical<br />
                thinking to build intelligent systems and<br />
                explore the frontier of AI.
              </p>

              {/* Quote */}
              <p
                className="text-xs italic mb-1 leading-tight"
                style={{ color: "red" }}
              >
                "Errors using inadequate data are much less<br />
                than those using no data at all"
              </p>
              <p className="text-xs mb-4">— Charles Babbage</p>
              <div className="w-full h-px bg-black dark:bg-white mb-2"></div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>India (Bangalore Urban)</span>
                </div>
                <div className="flex items-center text-xs">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    {new Date().toLocaleTimeString("en-US", {
                      timeZone: "Asia/Kolkata",
                      hour: "2-digit",
                      minute: "2-digit",
                    })} (IST) /{"  "}{new Date().toLocaleTimeString("en-US", {
                      timeZone: "UTC",
                      hour: "2-digit",
                      minute: "2-digit",
                    })} (UTC)
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>
                    <a
                      href="https://www.linkedin.com/company/ihx-india/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      IHX Pvt. Ltd. - A Perfios Company
                    </a>
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  <Github className="w-4 h-4 mr-2" />
                  <span>
                    <a
                      href="https://github.com/ManavvGarg/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      gh/manavvgarg
                    </a>
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  <Linkedin className="w-4 h-4 mr-2" />
                  <span>
                    <a
                      href="https://www.linkedin.com/in/manavvgarg/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      in/manavvgarg
                    </a>
                  </span>
                </div>
              </div>
              <div className="w-full h-px bg-black dark:bg-white mb-2"></div>

              {/* Interests */}
              <div className="space-y-2">
                <div className="flex items-center text-xs">
                  <Book className="w-4 h-4 mr-2" />
                  <span>The Laws of Human Nature - Robert Greene</span>
                </div>
                <div className="flex items-center text-xs">
                  <Instagram className="w-4 h-4 mr-2" />
                  <span>
                    <a
                      href="https://www.instagram.com/11mnv.design/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      @11mnv.design (Instagram)
                    </a>
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  <span>
                    <SpotifyNowPlaying />
                  </span>
                </div>
              </div>
              <div className="w-full h-px bg-black dark:bg-white mt-2"></div>
            </div>

            {/* Right Column - bordered with scrollbar */}
            <div
              className="w-2/3 border border-black dark:border-white overflow-auto"
              style={{ height: "auto" }}
            >
              <div
                className="border-b border-black dark:border-white overflow-auto custom-scrollbar"
                style={{ height: "665px" }}
              >
                {renderActivePage()}
              </div>

              {/* GitHub stats - properly positioned below the content */}
              <div className="flex space-x-3 mt-3 justify-center">
                <Image
                  src="https://github-readme-stats.vercel.app/api?username=manavvgarg&show_icons=false&theme=swift&include_all_commits=true"
                  alt="GitHub Stats"
                  width={380}
                  height={150}
                  className="border border-black dark:border-white"
                />
                <Image
                  src="https://github-readme-stats.vercel.app/api/top-langs/?username=ManavvGarg&hide=lua&theme=swift&layout=donut"
                  alt="Most Used Languages"
                  width={270}
                  height={150}
                  className="border border-black dark:border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - simple copyright */}
      <footer className="py-4 text-center text-xs">
        © 2025 | Manav Garg
      </footer>
    </div>
  );
}
