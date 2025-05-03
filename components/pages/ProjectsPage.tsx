import React from "react";
import Image from "next/image";

// Import repositories data
// In Next.js, we would typically use this in an API route or fetch it
// Here we're importing it directly
import reposData from "../../public/repos.json";

export default function ProjectsPage() {
  const { base_url, repos } = reposData[0];

  return (
    <div className="p-4 font-mono">
      <h2 className="text-xl font-bold mb-6">My Projects</h2>

      <div className="space-y-8">
        {/* Map through each category */}
        {Object.entries(repos).map(([category, repoList]) => (
          <div key={category} className="mb-8">
            <h3 className="text-md font-bold mb-3 border-b border-black dark:border-white pb-1">
              {category}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Map through each repository in the category */}
              {Array.isArray(repoList) && repoList.map((repo) => (
                <a
                  key={repo}
                  href={`https://github.com/manavvgarg/${repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-black dark:border-white hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={`${base_url}${repo}`}
                    alt={`${repo} repository`}
                    width={400}
                    height={200}
                    className="w-full"
                  />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm mt-6">
        You can find more projects on my{" "}
        <a
          href="https://github.com/manavvgarg"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub profile
        </a>.
      </p>
    </div>
  );
}
