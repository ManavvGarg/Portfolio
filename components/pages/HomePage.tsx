import React from "react";

interface AboutData {
  paragraphs: string[];
  achievements: string[];
  professionalInterests: string[];
  beyondTechnology: string;
}

export default function HomePage({ data }: { data: AboutData }) {
  return (
    <div className="p-2 md:p-4 font-mono">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">About Me</h2>

      <div className="space-y-3 md:space-y-4 text-xs md:text-sm">
        {data.paragraphs.map((p, i) => (
          <p key={i} className="mb-4">
            {p}
          </p>
        ))}

        <div className="mb-4">
          <b>Achievements</b>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            {data.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <b>Professional Interests</b>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            {data.professionalInterests.map((interest, i) => (
              <li key={i}>{interest}</li>
            ))}
          </ul>
        </div>

        <p>
          <b>Beyond Technology</b>
          <br />
          {data.beyondTechnology}
        </p>
      </div>
    </div>
  );
}
