"use client";

import { IBM_Plex_Mono } from "next/font/google";
import { useState, useEffect, useCallback } from "react";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

type Tab = "sidebar" | "about" | "resume" | "projects" | "blog";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("sidebar");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const fetchData = useCallback(async (pwd: string) => {
    const res = await fetch("/api/admin/portfolio", {
      headers: { "x-admin-password": pwd },
    });
    if (!res.ok) throw new Error("Unauthorized");
    setData(await res.json());
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
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
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

  const tabs: Tab[] = ["sidebar", "about", "resume", "projects", "blog"];

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
        {activeTab === "sidebar" && <SidebarEditor data={data} update={update} password={password} />}
        {activeTab === "about" && <AboutEditor data={data} update={update} />}
        {activeTab === "resume" && <ResumeEditor data={data} update={update} password={password} />}
        {activeTab === "projects" && <ProjectsEditor data={data} update={update} />}
        {activeTab === "blog" && <BlogEditor password={password} />}
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
function SidebarEditor({ data, update, password }: { data: any; update: (path: string, value: any) => void; password: string }) {
  const s = data.sidebar;
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadMsg, setImageUploadMsg] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setImageUploadMsg("");
    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      const res = await fetch("/api/admin/profile-image", {
        method: "PUT",
        headers: { "x-admin-password": password },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const result = await res.json();
      update("sidebar.profileImage", result.path);
      setImageUploadMsg("Profile image uploaded successfully!");
    } catch (err) {
      setImageUploadMsg(err instanceof Error ? err.message : "Upload failed");
    }
    setUploadingImage(false);
    setTimeout(() => setImageUploadMsg(""), 3000);
  };

  return (
    <div>
      <h2 className="text-base font-bold mb-4">Sidebar Info</h2>

      {/* Profile Image Upload */}
      <div className="mb-4 border border-black dark:border-white p-3">
        <label className="text-xs font-bold block mb-2">Upload Profile Image</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleImageUpload}
          disabled={uploadingImage}
          className="text-xs font-mono"
        />
        {uploadingImage && <p className="text-xs mt-1">Uploading...</p>}
        {imageUploadMsg && (
          <p className={`text-xs mt-1 ${imageUploadMsg.includes("success") ? "text-green-600" : "text-red-500"}`}>
            {imageUploadMsg}
          </p>
        )}
        <p className="text-xs mt-2 text-gray-500">
          Current: {s.profileImage}
        </p>
      </div>

      <Field
        label="Profile Image Path (auto-updated on upload)"
        value={s.profileImage}
        onChange={(v) => update("sidebar.profileImage", v)}
      />
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
function ResumeEditor({ data, update, password }: { data: any; update: (path: string, value: any) => void; password: string }) {
  const r = data.resume;
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg("");
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await fetch("/api/admin/resume", {
        method: "PUT",
        headers: { "x-admin-password": password },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const result = await res.json();
      update("resume.resumeLink", result.path);
      setUploadMsg("Resume uploaded successfully!");
    } catch (err) {
      setUploadMsg(err instanceof Error ? err.message : "Upload failed");
    }
    setUploading(false);
    setTimeout(() => setUploadMsg(""), 3000);
  };

  return (
    <div>
      <h2 className="text-base font-bold mb-4">Resume</h2>

      {/* Upload */}
      <div className="mb-4 border border-black dark:border-white p-3">
        <label className="text-xs font-bold block mb-2">Upload New Resume PDF</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleResumeUpload}
          disabled={uploading}
          className="text-xs font-mono"
        />
        {uploading && <p className="text-xs mt-1">Uploading...</p>}
        {uploadMsg && (
          <p className={`text-xs mt-1 ${uploadMsg.includes("success") ? "text-green-600" : "text-red-500"}`}>
            {uploadMsg}
          </p>
        )}
        <p className="text-xs mt-2 text-gray-500">
          Current: <a href={r.resumeLink} target="_blank" className="underline">{r.resumeLink}</a>
        </p>
      </div>

      <Field
        label="Resume PDF Link (auto-updated on upload)"
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
  const categoryKeys = Object.keys(p.categories);

  const moveCategory = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categoryKeys.length) return;
    const reordered = [...categoryKeys];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    const newCategories: Record<string, string[]> = {};
    for (const key of reordered) {
      newCategories[key] = p.categories[key];
    }
    update("projects.categories", newCategories);
  };

  return (
    <div>
      <h2 className="text-base font-bold mb-4">Projects</h2>
      <Field
        label="Base URL"
        value={p.baseUrl}
        onChange={(v) => update("projects.baseUrl", v)}
      />
      {categoryKeys.map((category, index) => (
        <div key={category} className="border border-black dark:border-white p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveCategory(index, -1)}
                  disabled={index === 0}
                  className="border border-black dark:border-white px-1.5 py-0 text-xs leading-tight hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveCategory(index, 1)}
                  disabled={index === categoryKeys.length - 1}
                  className="border border-black dark:border-white px-1.5 py-0 text-xs leading-tight hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  ↓
                </button>
              </div>
              <h4 className="text-xs font-bold">{category}</h4>
            </div>
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
            items={p.categories[category] as string[]}
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

// Blog editor — self-contained, manages its own data/save lifecycle
interface BlogMedia {
  name: string;
  path: string;
  size: number;
}

function BlogEditor({ password }: { password: string }) {
  const [posts, setPosts] = useState<string[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form fields
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  // Media
  const [media, setMedia] = useState<BlogMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  // Status
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const headers = { "x-admin-password": password };

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog", { headers });
      if (res.ok) setPosts(await res.json());
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const clearForm = () => {
    setSlug("");
    setTitle("");
    setDate("");
    setDescription("");
    setTags("");
    setContent("");
    setMedia([]);
    setSelectedSlug(null);
    setIsNew(false);
    setSaveMsg("");
    setUploadMsg("");
  };

  const handleNew = () => {
    clearForm();
    setIsNew(true);
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleSelect = async (s: string) => {
    setLoading(true);
    setSaveMsg("");
    setUploadMsg("");
    try {
      const res = await fetch(`/api/admin/blog?slug=${encodeURIComponent(s)}`, {
        headers,
      });
      if (!res.ok) throw new Error("Failed to load post");
      const post = await res.json();
      setSelectedSlug(s);
      setIsNew(false);
      setSlug(s);
      setTitle(post.title);
      setDate(post.date);
      setDescription(post.description);
      setTags((post.tags || []).join(", "));
      setContent(post.content);

      // Fetch media for this post
      const mediaRes = await fetch(
        `/api/admin/blog/media?slug=${encodeURIComponent(s)}`,
        { headers }
      );
      if (mediaRes.ok) setMedia(await mediaRes.json());
      else setMedia([]);
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Failed to load");
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    const targetSlug = isNew ? slug.trim() : selectedSlug;
    if (!targetSlug) {
      setSaveMsg("Slug is required");
      return;
    }
    if (!title.trim()) {
      setSaveMsg("Title is required");
      return;
    }

    setSaving(true);
    setSaveMsg("");
    try {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: targetSlug,
          title: title.trim(),
          date,
          description: description.trim(),
          tags: tagsArray,
          content,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Publish failed");
      }
      setSaveMsg("Published successfully!");
      setSelectedSlug(targetSlug);
      setIsNew(false);
      fetchPosts();
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Publish failed");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 4000);
  };

  const handleDelete = async (s: string) => {
    if (!confirm(`Delete post "${s}"? This cannot be undone.`)) return;
    try {
      const res = await fetch("/api/admin/blog", {
        method: "DELETE",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ slug: s }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Delete failed");
      }
      if (selectedSlug === s) clearForm();
      fetchPosts();
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    const targetSlug = isNew ? slug.trim() : selectedSlug;
    if (!file || !targetSlug) {
      setUploadMsg("Save the post first (need a slug for media folder)");
      return;
    }
    setUploading(true);
    setUploadMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", targetSlug);
      const res = await fetch("/api/admin/blog/media", {
        method: "PUT",
        headers,
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const result = await res.json();
      setMedia((prev) => [
        ...prev,
        { name: result.name, path: result.path, size: 0 },
      ]);
      setUploadMsg("Uploaded!");
    } catch (err) {
      setUploadMsg(err instanceof Error ? err.message : "Upload failed");
    }
    setUploading(false);
    e.target.value = "";
    setTimeout(() => setUploadMsg(""), 3000);
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const isEditing = selectedSlug !== null || isNew;

  return (
    <div>
      <h2 className="text-base font-bold mb-4">Blog Posts</h2>

      {/* Post List */}
      <div className="mb-4">
        {posts.length === 0 && !isNew && (
          <p className="text-xs text-gray-500 mb-2">No posts yet.</p>
        )}
        {posts.map((s) => (
          <div
            key={s}
            className={`flex items-center justify-between border border-black dark:border-white p-2 mb-1 text-xs ${
              selectedSlug === s
                ? "bg-black text-white dark:bg-white dark:text-black"
                : ""
            }`}
          >
            <button
              onClick={() => handleSelect(s)}
              className="font-mono hover:underline text-left flex-1"
            >
              {s}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(s);
              }}
              className={`ml-2 px-2 py-0.5 text-xs border ${
                selectedSlug === s
                  ? "border-red-300 text-red-300 hover:bg-red-500 hover:text-white"
                  : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              }`}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          onClick={handleNew}
          className="border border-black dark:border-white px-3 py-1 text-xs mt-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
        >
          + New Post
        </button>
      </div>

      {/* Editor */}
      {isEditing && (
        <div className="border border-black dark:border-white p-4">
          {loading ? (
            <p className="text-xs">Loading...</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold">
                  {isNew ? "New Post" : `Editing: ${selectedSlug}`}
                </h3>
                <div className="flex items-center gap-2">
                  {saveMsg && (
                    <span
                      className={`text-xs ${saveMsg.includes("success") ? "text-green-600" : "text-red-500"}`}
                    >
                      {saveMsg}
                    </span>
                  )}
                  <button
                    onClick={handlePublish}
                    disabled={saving}
                    className="border border-black dark:border-white px-4 py-1 text-xs font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-50"
                  >
                    {saving ? "Publishing..." : "Publish"}
                  </button>
                  <button
                    onClick={clearForm}
                    className="border border-black dark:border-white px-3 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Slug */}
              {isNew && (
                <div className="mb-3">
                  <label className="text-xs font-bold block mb-1">Slug</label>
                  <div className="flex gap-2">
                    <input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="my-post-slug"
                      className="flex-1 border border-black dark:border-white p-2 bg-transparent text-xs font-mono"
                    />
                    <button
                      onClick={() => setSlug(slugify(title))}
                      className="border border-black dark:border-white px-2 py-1 text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black whitespace-nowrap"
                    >
                      From title
                    </button>
                  </div>
                </div>
              )}

              {/* Frontmatter fields */}
              <Field
                label="Title"
                value={title}
                onChange={setTitle}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date" value={date} onChange={setDate} />
                <Field
                  label="Tags (comma-separated)"
                  value={tags}
                  onChange={setTags}
                />
              </div>
              <Field
                label="Description"
                value={description}
                onChange={setDescription}
                multiline
                rows={2}
              />

              {/* Markdown Content */}
              <div className="mb-4">
                <label className="text-xs font-bold block mb-1">
                  Content (Markdown)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="w-full border border-black dark:border-white p-2 bg-transparent text-xs font-mono leading-relaxed"
                  placeholder="Write your blog post in Markdown..."
                />
              </div>

              {/* Media Upload */}
              <div className="border border-black dark:border-white p-3 mb-4">
                <label className="text-xs font-bold block mb-2">
                  Media Files
                </label>
                <div className="mb-2">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    disabled={uploading || (!slug.trim() && !selectedSlug)}
                    className="text-xs font-mono"
                  />
                  {uploading && (
                    <span className="text-xs ml-2">Uploading...</span>
                  )}
                  {uploadMsg && (
                    <span
                      className={`text-xs ml-2 ${uploadMsg === "Uploaded!" ? "text-green-600" : "text-red-500"}`}
                    >
                      {uploadMsg}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 mb-2">
                  Files are stored in public/blog/{slug || selectedSlug || "<slug>"}/.
                  Use the markdown snippets below to embed them.
                </p>
                {media.length > 0 && (
                  <div className="space-y-1">
                    {media.map((m) => (
                      <div
                        key={m.name}
                        className="flex items-center gap-2 text-xs font-mono bg-gray-50 dark:bg-gray-900 p-1.5"
                      >
                        <span className="flex-1 truncate">{m.name}</span>
                        <code
                          className="text-[10px] cursor-pointer hover:underline border border-black dark:border-white px-1.5 py-0.5 shrink-0"
                          title="Click to copy"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `![${m.name}](${m.path})`
                            );
                          }}
                        >
                          Copy ![...]
                        </code>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom publish */}
              <div className="flex items-center justify-end gap-2">
                {saveMsg && (
                  <span
                    className={`text-xs ${saveMsg.includes("success") ? "text-green-600" : "text-red-500"}`}
                  >
                    {saveMsg}
                  </span>
                )}
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="border border-black dark:border-white px-6 py-1.5 text-xs font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-50"
                >
                  {saving ? "Publishing..." : "Publish"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

