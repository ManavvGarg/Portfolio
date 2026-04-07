"use client";

import { IBM_Plex_Mono } from "next/font/google";
import { useState, useEffect, useCallback } from "react";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

type Tab = "sidebar" | "about" | "resume" | "projects" | "crosswords";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("sidebar");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [crosswords, setCrosswords] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const fetchData = useCallback(async (pwd: string) => {
    const [portfolioRes, crosswordsRes] = await Promise.all([
      fetch("/api/admin/portfolio", {
        headers: { "x-admin-password": pwd },
      }),
      fetch("/api/admin/crosswords", {
        headers: { "x-admin-password": pwd },
      }),
    ]);
    if (!portfolioRes.ok) throw new Error("Unauthorized");
    setData(await portfolioRes.json());
    if (crosswordsRes.ok) setCrosswords(await crosswordsRes.json());
  }, []);

  const handleLogin = async () => {
    try {
      setAuthError("");
      await fetchData(password);
      setAuthenticated(true);
    } catch {
      setAuthError("Invalid password");
    }
  };

  const save = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const [r1, r2] = await Promise.all([
        fetch("/api/admin/portfolio", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": password,
          },
          body: JSON.stringify(data),
        }),
        fetch("/api/admin/crosswords", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": password,
          },
          body: JSON.stringify(crosswords),
        }),
      ]);
      if (!r1.ok || !r2.ok) {
        const err = !r1.ok ? await r1.json() : await r2.json();
        throw new Error(err.error || "Save failed");
      }
      setSaveMsg("Saved successfully!");
    } catch (e) {
      setSaveMsg(e instanceof Error ? e.message : "Failed to save");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  // Helper to update nested data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update = (path: string, value: any) => {
    setData((prev: typeof data) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  if (!authenticated) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${ibmPlexMono.className}`}
      >
        <div className="border border-black dark:border-white p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold mb-4">Admin Login</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-black dark:border-white p-2 mb-3 bg-transparent text-sm font-mono"
          />
          {authError && (
            <p className="text-red-500 text-xs mb-3">{authError}</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full border border-black dark:border-white p-2 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8">Loading...</div>;

  const tabs: Tab[] = ["sidebar", "about", "resume", "projects", "crosswords"];

  return (
    <div className={`min-h-screen ${ibmPlexMono.className}`}>
      {/* Header */}
      <div className="border-b border-black dark:border-white p-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Portfolio Admin</h1>
        <div className="flex items-center gap-3">
          {saveMsg && (
            <span
              className={`text-xs ${saveMsg.includes("success") ? "text-green-600" : "text-red-500"}`}
            >
              {saveMsg}
            </span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="border border-black dark:border-white px-4 py-1.5 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-black dark:border-white flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm uppercase border-r border-black dark:border-white ${
              activeTab === tab
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "hover:bg-gray-100 dark:hover:bg-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-w-4xl mx-auto">
        {activeTab === "sidebar" && <SidebarEditor data={data} update={update} />}
        {activeTab === "about" && <AboutEditor data={data} update={update} />}
        {activeTab === "resume" && <ResumeEditor data={data} update={update} />}
        {activeTab === "projects" && <ProjectsEditor data={data} update={update} />}
        {activeTab === "crosswords" && (
          <CrosswordsEditor crosswords={crosswords} setCrosswords={setCrosswords} />
        )}
      </div>
    </div>
  );
}

// Reusable field components
function Field({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const cls =
    "w-full border border-black dark:border-white p-2 bg-transparent text-xs font-mono";
  return (
    <div className="mb-3">
      <label className="text-xs font-bold block mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={cls}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </div>
  );
}

function ArrayField({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="mb-4">
      <label className="text-xs font-bold block mb-1">{label}</label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-1">
          <input
            value={item}
            onChange={(e) => {
              const copy = [...items];
              copy[i] = e.target.value;
              onChange(copy);
            }}
            className="flex-1 border border-black dark:border-white p-1.5 bg-transparent text-xs font-mono"
          />
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="border border-red-500 text-red-500 px-2 text-xs hover:bg-red-500 hover:text-white"
          >
            x
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, ""])}
        className="border border-black dark:border-white px-3 py-1 text-xs mt-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
      >
        + Add
      </button>
    </div>
  );
}

// Section editors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SidebarEditor({ data, update }: { data: any; update: (path: string, value: any) => void }) {
  const s = data.sidebar;
  return (
    <div>
      <h2 className="text-base font-bold mb-4">Sidebar Info</h2>
      <Field label="Name" value={s.name} onChange={(v) => update("sidebar.name", v)} />
      <ArrayField
        label="Titles"
        items={s.titles}
        onChange={(v) => update("sidebar.titles", v)}
      />
      <Field
        label="Bio"
        value={s.bio}
        onChange={(v) => update("sidebar.bio", v)}
        multiline
      />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Quote Text"
          value={s.quote.text}
          onChange={(v) => update("sidebar.quote.text", v)}
          multiline
          rows={2}
        />
        <Field
          label="Quote Author"
          value={s.quote.author}
          onChange={(v) => update("sidebar.quote.author", v)}
        />
      </div>
      <Field
        label="Location"
        value={s.location}
        onChange={(v) => update("sidebar.location", v)}
      />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Company Name"
          value={s.company.name}
          onChange={(v) => update("sidebar.company.name", v)}
        />
        <Field
          label="Company URL"
          value={s.company.url}
          onChange={(v) => update("sidebar.company.url", v)}
        />
      </div>
      <h3 className="text-sm font-bold mt-4 mb-2">Social Links</h3>
      {Object.entries(s.social).map(([key, val]) => (
        <div key={key} className="grid grid-cols-2 gap-3 mb-2">
          <Field
            label={`${key} URL`}
            value={(val as { url: string }).url}
            onChange={(v) => update(`sidebar.social.${key}.url`, v)}
          />
          <Field
            label={`${key} Label`}
            value={(val as { label: string }).label}
            onChange={(v) => update(`sidebar.social.${key}.label`, v)}
          />
        </div>
      ))}
      <Field
        label="Currently Reading"
        value={s.currentlyReading}
        onChange={(v) => update("sidebar.currentlyReading", v)}
      />
      <Field
        label="GitHub Username"
        value={s.githubUsername}
        onChange={(v) => update("sidebar.githubUsername", v)}
      />
      <Field
        label="Profile Image Path"
        value={s.profileImage}
        onChange={(v) => update("sidebar.profileImage", v)}
      />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AboutEditor({ data, update }: { data: any; update: (path: string, value: any) => void }) {
  const a = data.about;
  return (
    <div>
      <h2 className="text-base font-bold mb-4">About Me</h2>
      <div className="mb-4">
        <label className="text-xs font-bold block mb-1">Bio Paragraphs</label>
        {a.paragraphs.map((p: string, i: number) => (
          <div key={i} className="flex gap-2 mb-2">
            <textarea
              value={p}
              onChange={(e) => {
                const copy = [...a.paragraphs];
                copy[i] = e.target.value;
                update("about.paragraphs", copy);
              }}
              rows={3}
              className="flex-1 border border-black dark:border-white p-2 bg-transparent text-xs font-mono"
            />
            <button
              onClick={() =>
                update(
                  "about.paragraphs",
                  a.paragraphs.filter((_: string, j: number) => j !== i)
                )
              }
              className="border border-red-500 text-red-500 px-2 text-xs hover:bg-red-500 hover:text-white self-start"
            >
              x
            </button>
          </div>
        ))}
        <button
          onClick={() => update("about.paragraphs", [...a.paragraphs, ""])}
          className="border border-black dark:border-white px-3 py-1 text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
        >
          + Add Paragraph
        </button>
      </div>
      <ArrayField
        label="Achievements"
        items={a.achievements}
        onChange={(v) => update("about.achievements", v)}
      />
      <div className="mb-4">
        <label className="text-xs font-bold block mb-1">
          Professional Interests
        </label>
        {a.professionalInterests.map((p: string, i: number) => (
          <div key={i} className="flex gap-2 mb-2">
            <textarea
              value={p}
              onChange={(e) => {
                const copy = [...a.professionalInterests];
                copy[i] = e.target.value;
                update("about.professionalInterests", copy);
              }}
              rows={2}
              className="flex-1 border border-black dark:border-white p-2 bg-transparent text-xs font-mono"
            />
            <button
              onClick={() =>
                update(
                  "about.professionalInterests",
                  a.professionalInterests.filter((_: string, j: number) => j !== i)
                )
              }
              className="border border-red-500 text-red-500 px-2 text-xs hover:bg-red-500 hover:text-white self-start"
            >
              x
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            update("about.professionalInterests", [
              ...a.professionalInterests,
              "",
            ])
          }
          className="border border-black dark:border-white px-3 py-1 text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
        >
          + Add Interest
        </button>
      </div>
      <Field
        label="Beyond Technology"
        value={a.beyondTechnology}
        onChange={(v) => update("about.beyondTechnology", v)}
        multiline
        rows={3}
      />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ResumeEditor({ data, update }: { data: any; update: (path: string, value: any) => void }) {
  const r = data.resume;
  return (
    <div>
      <h2 className="text-base font-bold mb-4">Resume</h2>
      <Field
        label="Resume PDF Link"
        value={r.resumeLink}
        onChange={(v) => update("resume.resumeLink", v)}
      />

      {/* Education */}
      <h3 className="text-sm font-bold mt-4 mb-2">Education</h3>
      {r.education.map((edu: { institution: string; degree: string; period: string; specialization: string; cgpa: string; cgpaMax: string; currentSemester: string }, i: number) => (
        <div key={i} className="border border-black dark:border-white p-3 mb-3">
          <Field
            label="Institution"
            value={edu.institution}
            onChange={(v) => {
              const copy = [...r.education];
              copy[i] = { ...copy[i], institution: v };
              update("resume.education", copy);
            }}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Degree"
              value={edu.degree}
              onChange={(v) => {
                const copy = [...r.education];
                copy[i] = { ...copy[i], degree: v };
                update("resume.education", copy);
              }}
            />
            <Field
              label="Period"
              value={edu.period}
              onChange={(v) => {
                const copy = [...r.education];
                copy[i] = { ...copy[i], period: v };
                update("resume.education", copy);
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field
              label="Specialization"
              value={edu.specialization}
              onChange={(v) => {
                const copy = [...r.education];
                copy[i] = { ...copy[i], specialization: v };
                update("resume.education", copy);
              }}
            />
            <Field
              label="CGPA"
              value={edu.cgpa}
              onChange={(v) => {
                const copy = [...r.education];
                copy[i] = { ...copy[i], cgpa: v };
                update("resume.education", copy);
              }}
            />
            <Field
              label="Current Semester"
              value={edu.currentSemester}
              onChange={(v) => {
                const copy = [...r.education];
                copy[i] = { ...copy[i], currentSemester: v };
                update("resume.education", copy);
              }}
            />
          </div>
        </div>
      ))}

      {/* Experience */}
      <h3 className="text-sm font-bold mt-4 mb-2">Experience</h3>
      {r.experience.map((exp: { company: string; current: boolean; roles: { title: string; period: string }[]; startDate: string; endDate: string | null; bullets: string[] }, i: number) => (
        <div key={i} className="border border-black dark:border-white p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold">{exp.company || "New Experience"}</h4>
            <button
              onClick={() =>
                update(
                  "resume.experience",
                  r.experience.filter((_: typeof exp, j: number) => j !== i)
                )
              }
              className="border border-red-500 text-red-500 px-2 py-0.5 text-xs hover:bg-red-500 hover:text-white"
            >
              Delete
            </button>
          </div>
          <Field
            label="Company"
            value={exp.company}
            onChange={(v) => {
              const copy = [...r.experience];
              copy[i] = { ...copy[i], company: v };
              update("resume.experience", copy);
            }}
          />
          <div className="flex items-center gap-2 mb-2">
            <label className="text-xs">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => {
                  const copy = [...r.experience];
                  copy[i] = { ...copy[i], current: e.target.checked };
                  update("resume.experience", copy);
                }}
                className="mr-1"
              />
              Current
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Start Date (YYYY-MM)"
              value={exp.startDate}
              onChange={(v) => {
                const copy = [...r.experience];
                copy[i] = { ...copy[i], startDate: v };
                update("resume.experience", copy);
              }}
            />
            <Field
              label="End Date (YYYY-MM)"
              value={exp.endDate || ""}
              onChange={(v) => {
                const copy = [...r.experience];
                copy[i] = { ...copy[i], endDate: v || null };
                update("resume.experience", copy);
              }}
            />
          </div>
          {/* Roles */}
          <label className="text-xs font-bold block mb-1 mt-2">Roles</label>
          {exp.roles.map((role: { title: string; period: string }, ri: number) => (
            <div key={ri} className="grid grid-cols-2 gap-2 mb-1">
              <input
                value={role.title}
                onChange={(e) => {
                  const copy = [...r.experience];
                  const roles = [...copy[i].roles];
                  roles[ri] = { ...roles[ri], title: e.target.value };
                  copy[i] = { ...copy[i], roles };
                  update("resume.experience", copy);
                }}
                placeholder="Role title"
                className="border border-black dark:border-white p-1.5 bg-transparent text-xs font-mono"
              />
              <div className="flex gap-1">
                <input
                  value={role.period}
                  onChange={(e) => {
                    const copy = [...r.experience];
                    const roles = [...copy[i].roles];
                    roles[ri] = { ...roles[ri], period: e.target.value };
                    copy[i] = { ...copy[i], roles };
                    update("resume.experience", copy);
                  }}
                  placeholder="Period"
                  className="flex-1 border border-black dark:border-white p-1.5 bg-transparent text-xs font-mono"
                />
                <button
                  onClick={() => {
                    const copy = [...r.experience];
                    copy[i] = {
                      ...copy[i],
                      roles: copy[i].roles.filter((_: typeof role, j: number) => j !== ri),
                    };
                    update("resume.experience", copy);
                  }}
                  className="border border-red-500 text-red-500 px-1.5 text-xs"
                >
                  x
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const copy = [...r.experience];
              copy[i] = {
                ...copy[i],
                roles: [...copy[i].roles, { title: "", period: "" }],
              };
              update("resume.experience", copy);
            }}
            className="border border-black dark:border-white px-2 py-0.5 text-xs mt-1 mb-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
          >
            + Role
          </button>
          {/* Bullets */}
          <ArrayField
            label="Bullets"
            items={exp.bullets}
            onChange={(v) => {
              const copy = [...r.experience];
              copy[i] = { ...copy[i], bullets: v };
              update("resume.experience", copy);
            }}
          />
        </div>
      ))}
      <button
        onClick={() =>
          update("resume.experience", [
            ...r.experience,
            {
              company: "",
              current: false,
              roles: [{ title: "", period: "" }],
              startDate: "",
              endDate: "",
              bullets: [""],
            },
          ])
        }
        className="border border-black dark:border-white px-3 py-1 text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black mb-4"
      >
        + Add Experience
      </button>

      {/* Skills */}
      <ArrayField
        label="Skills (rows)"
        items={r.skills}
        onChange={(v) => update("resume.skills", v)}
      />
      <ArrayField
        label="Domains (rows)"
        items={r.domains}
        onChange={(v) => update("resume.domains", v)}
      />

      {/* Coursework */}
      <h3 className="text-sm font-bold mt-4 mb-2">Coursework</h3>
      {r.coursework.map((cw: { category: string; items: string }, i: number) => (
        <div key={i} className="grid grid-cols-3 gap-2 mb-2">
          <input
            value={cw.category}
            onChange={(e) => {
              const copy = [...r.coursework];
              copy[i] = { ...copy[i], category: e.target.value };
              update("resume.coursework", copy);
            }}
            placeholder="Category"
            className="border border-black dark:border-white p-1.5 bg-transparent text-xs font-mono"
          />
          <input
            value={cw.items}
            onChange={(e) => {
              const copy = [...r.coursework];
              copy[i] = { ...copy[i], items: e.target.value };
              update("resume.coursework", copy);
            }}
            placeholder="Items (• separated)"
            className="col-span-2 border border-black dark:border-white p-1.5 bg-transparent text-xs font-mono"
          />
        </div>
      ))}
      <button
        onClick={() =>
          update("resume.coursework", [
            ...r.coursework,
            { category: "", items: "" },
          ])
        }
        className="border border-black dark:border-white px-3 py-1 text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
      >
        + Add Coursework
      </button>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProjectsEditor({ data, update }: { data: any; update: (path: string, value: any) => void }) {
  const p = data.projects;
  const [newCategory, setNewCategory] = useState("");

  return (
    <div>
      <h2 className="text-base font-bold mb-4">Projects</h2>
      <Field
        label="Base URL"
        value={p.baseUrl}
        onChange={(v) => update("projects.baseUrl", v)}
      />
      {Object.entries(p.categories).map(([category, repos]) => (
        <div key={category} className="border border-black dark:border-white p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold">{category}</h4>
            <button
              onClick={() => {
                const copy = { ...p.categories };
                delete copy[category];
                update("projects.categories", copy);
              }}
              className="border border-red-500 text-red-500 px-2 py-0.5 text-xs hover:bg-red-500 hover:text-white"
            >
              Delete Category
            </button>
          </div>
          <ArrayField
            label="Repositories"
            items={repos as string[]}
            onChange={(v) => {
              const copy = { ...p.categories };
              copy[category] = v;
              update("projects.categories", copy);
            }}
          />
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="flex-1 border border-black dark:border-white p-1.5 bg-transparent text-xs font-mono"
        />
        <button
          onClick={() => {
            if (newCategory.trim()) {
              update("projects.categories", {
                ...p.categories,
                [newCategory.trim()]: [],
              });
              setNewCategory("");
            }
          }}
          className="border border-black dark:border-white px-3 py-1 text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
        >
          + Add Category
        </button>
      </div>
    </div>
  );
}

function CrosswordsEditor({
  crosswords,
  setCrosswords,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  crosswords: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCrosswords: (v: any[]) => void;
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div>
      <h2 className="text-base font-bold mb-4">
        Crosswords ({crosswords.length} puzzles)
      </h2>
      <p className="text-xs mb-4 text-gray-600 dark:text-gray-400">
        Edit crossword data as JSON. For complex edits, expand a puzzle below.
      </p>
      {crosswords.map((cw, i) => (
        <div key={i} className="border border-black dark:border-white mb-2">
          <button
            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
            className="w-full text-left p-2 text-xs font-bold flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <span>
              {cw.id} — {cw.title}
            </span>
            <span>{expandedIdx === i ? "▲" : "▼"}</span>
          </button>
          {expandedIdx === i && (
            <div className="p-2 border-t border-black dark:border-white">
              <textarea
                value={JSON.stringify(cw, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    const copy = [...crosswords];
                    copy[i] = parsed;
                    setCrosswords(copy);
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                rows={20}
                className="w-full border border-black dark:border-white p-2 bg-transparent text-xs font-mono"
              />
              <button
                onClick={() => setCrosswords(crosswords.filter((_, j) => j !== i))}
                className="border border-red-500 text-red-500 px-3 py-1 text-xs mt-2 hover:bg-red-500 hover:text-white"
              >
                Delete Puzzle
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={() =>
          setCrosswords([
            ...crosswords,
            {
              id: `mini-${String(crosswords.length + 1).padStart(3, "0")}`,
              title: "New Puzzle",
              grid: ["#####", "#####", "#####", "#####", "#####"],
              clues: { across: [], down: [] },
            },
          ])
        }
        className="border border-black dark:border-white px-3 py-1 text-xs mt-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
      >
        + Add Puzzle
      </button>
    </div>
  );
}
