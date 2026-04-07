import React from "react";
import Link from "next/link";

interface Education {
  institution: string;
  degree: string;
  period: string;
  specialization: string;
  cgpa: string;
  cgpaMax: string;
  currentSemester: string;
}

interface Experience {
  company: string;
  current: boolean;
  roles: { title: string; period: string }[];
  startDate: string;
  endDate: string | null;
  bullets: string[];
}

interface Coursework {
  category: string;
  items: string;
}

interface ResumeData {
  resumeLink: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  domains: string[];
  coursework: Coursework[];
}

export default function ResumePage({ data }: { data: ResumeData }) {
  // Calculate total experience from startDate/endDate
  const totalMonths = data.experience.reduce((total, exp) => {
    const [startY, startM] = exp.startDate.split("-").map(Number);
    const end = exp.endDate
      ? exp.endDate.split("-").map(Number)
      : [new Date().getFullYear(), new Date().getMonth() + 1];
    const months = (end[0] - startY) * 12 + (end[1] - startM + 1);
    return total + months;
  }, 0);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const experienceSummary = `(${
    years > 0 ? `${years} year${years !== 1 ? "s" : ""}` : ""
  }${years > 0 && months > 0 ? ", " : ""}${
    months > 0 ? `${months} month${months !== 1 ? "s" : ""}` : ""
  })`;

  return (
    <div className="p-2 md:p-4 font-mono">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">My Resume</h2>

      <div className="text-xs md:text-sm">
        <p className="mb-6">
          You can view and download my full resume directly from github{" "}
          <Link
            href={data.resumeLink}
            target="_blank"
            className="underline"
          >
            here
          </Link>
          .
        </p>

        <div className="space-y-4">
          <h1 className="font-medium text-xl">Summarized Resume Below ▼</h1>

          <section>
            <h3 className="font-bold text-base mb-2">Education</h3>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h4 className="font-medium">
                    <u>
                      <b>{edu.institution}</b>
                    </u>
                  </h4>
                  <p>
                    {edu.degree} • {edu.period}
                  </p>
                  <p>
                    Specialization in {edu.specialization} • Current CGPA:{" "}
                    <span className="text-red-500 dark:text-red-400">
                      {edu.cgpa}
                    </span>
                    /{edu.cgpaMax} • Current Semester: {edu.currentSemester}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">
              Experience{" "}
              <span className="font-normal text-sm">{experienceSummary}</span>
            </h3>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <h4 className="font-medium">
                    <u>
                      <b>
                        {exp.company}
                        {exp.current ? " (Current)" : ""}
                      </b>
                    </u>
                  </h4>
                  {exp.roles.map((role, ri) => (
                    <p key={ri}>
                      <span className="text-blue-800 dark:text-blue-400 font-medium">
                        {role.title}
                      </span>{" "}
                      • {role.period}
                    </p>
                  ))}
                  <p>
                    {exp.bullets.map((bullet, bi) => (
                      <span key={bi}>
                        • {bullet}
                        {bi < exp.bullets.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">Skills</h3>
            <div className="space-y-1">
              {data.skills.map((row, i) => (
                <p key={i}>{row}</p>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">Domains & Techniques</h3>
            <div className="space-y-1">
              {data.domains.map((row, i) => (
                <p key={i}>{row}</p>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">Relevant Coursework</h3>
            <div className="space-y-2">
              {data.coursework.map((cw, i) => (
                <div key={i}>
                  <p className="font-medium underline">{cw.category}</p>
                  <p className="text-xs">{cw.items}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
