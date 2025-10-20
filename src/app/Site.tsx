"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Single-file Next.js portfolio page pre-filled from the user's resume.
 * - Put this in app/page.tsx (Next.js App Router).
 * - Requires TailwindCSS for styling.
 * - Put resume.pdf in /public so DATA.cta.resumeHref = "/resume.pdf" works.
 */

// ---------- Site Data pulled from uploaded resume.pdf ----------
const DATA = {
  name: "Nyan Prakash",
  location: "Washington, D.C.",
  subtitleCycle: [
    "Software Engineer",
    "Full-Stack Builder",
    "Unity & Robotics",
    "AI & ML Enthusiast",
    "Rapid Prototyper",
  ],
  bio:
    "I design and build full-stack systems, game & robotics prototypes, and AI tools. I thrive on shipping fast, learning new stacks, and solving real-world problems with technology.",
  cta: {
    resumeHref: "/resume.pdf",
    email: "mailto:nyanjprakash@gmail.com",
    phone: "tel:315-882-6569",
  },
  socials: [
    { label: "Website", href: "https://nyanprakash.com" },
    { label: "GitHub", href: "https://github.com/Nyan-Prakash" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/nyan-prakash" },
    { label: "Twitter", href: "https://twitter.com/nyanprakash" },
  ],
  projects: [
    {
      title: "EcoCoin — Decentralized Emissions Trading",
      blurb:
        "Blockchain-based trading platform for emission allowances. Built with React, FastAPI, and Firebase, featuring a predictive carbon-price algorithm.",
      tags: ["React", "FastAPI", "Firebase", "Blockchain", "ML"],
      href: "https://github.com/ShaunakS05/EcoCoin",
    },
    {
      title: "HealthScope — Geospatial Public Health Analytics",
      blurb:
        "Geospatial ML platform to predict and visualize public health trends. Interactive React dashboard powered by PyTorch models.",
      tags: ["React", "PyTorch", "GIS", "DataViz"],
      href: "#projects",
    },
    {
      title: "Plately — AI Menu Engineer",
      blurb:
        "Agent-based model (ABM) for restaurant menu optimization. Ingests data and uses Mesa + FastAPI for dynamic pricing.",
      tags: ["React", "Mesa", "FastAPI", "ABM"],
      href: "#projects",
    },
    {
      title: "DeepGuard — Multimodal Deepfake Detection",
      blurb:
        "Real-time deepfake detection across text, voice, and video. FastAPI backend with multimodal ML scoring.",
      tags: ["Python", "FastAPI", "ML", "Security"],
      href: "#projects",
    },
  ],
  experience: [
    {
      role: "Software Engineer Intern",
      org: "The Outpost",
      period: "May 2025 — Aug 2025",
      points: [
        "Built a market research tool for web scraping and startup discovery.",
        "Developed productivity tools for sales and account management teams.",
        "Created an internal agent for automated meeting prep.",
      ],
    },
    {
      role: "Undergraduate Research Assistant",
      org: "UVA Link Lab",
      period: "Nov 2024 — Present",
      points: [
        "Optimized urban roads for bike and e-scooter safety using data-driven trials.",
        "Developed a Unity/C# simulation integrating real-world bike telemetry.",
      ],
    },
    {
      role: "Software Engineering Intern",
      org: "Pacific Northwest National Laboratory",
      period: "May 2024 — Aug 2024",
      points: [
        "Built a DOE website for national security funding allocation.",
        "Reduced bundle size by 50% via React code-splitting; implemented .NET backend functions.",
      ],
    },
    {
      role: "Founder",
      org: "AutoDog",
      period: "Dec 2023 — Jun 2024",
      points: [
        "Created a smart dog harness using Arduino and BLE for automated training.",
        "Won 1st in Virginia and 3rd nationally in SkillsUSA Engineering Technology & Design.",
      ],
    },
    {
      role: "Programming Captain",
      org: "Gryphon Robotics 5549",
      period: "Sept 2021 — Jun 2023",
      points: [
        "Led a 20-member team to design and build a custom robot for FIRST Robotics Competition.",
        "Mentored 15+ students in Java programming and robotics.",
      ],
    },
    {
      role: "Co-Founder",
      org: "Jump Robotics 8262",
      period: "Sept 2019 — Jun 2021",
      points: [
        "Founded a robotics team after school team rejection; led 7 peers.",
        "Learned CAD, robotics programming, and design through hands-on projects.",
      ],
    },
  ],
  education: [
    {
      institution: "Fractal Tech Bootcamp",
      details: "12-week AI startup bootcamp — 2024",
    },
    {
      institution: "University of Virginia",
      details: "B.S. Computer Science & Economics — (on leave)",
    },
    {
      institution: "Northern Virginia Community College",
      details: "A.S. Engineering — Aug 2023 — May 2024; GPA: 3.9/4.0",
    },
  ],
  writing: [
    { title: "Notes from my first CTF weekend", href: "#writing", date: "Apr 19, 2025" },
    { title: "Debugging React Suspense waterfalls", href: "#writing", date: "Jun 2, 2025" },
    { title: "Building a Unity robotics simulation", href: "#writing", date: "May 10, 2025" },
  ],
  skills: [
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Unity",
    "C#",
    "TensorFlow",
    "PyTorch",
    "Arduino",
    "Raspberry Pi",
    "Docker",
    "GCP",
    "AWS",
    "Mesa",
    "FastAPI",
    "GIS",
    "Blockchain",
  ],
  awards: [
    "HackNYU — 2nd place Best Fintech Hack (Feb 2025)",
    "HopHacks (Johns Hopkins) — 3rd place Best Use of Data (Oct 2024)",
    "SkillsUSA Engineering Technology & Design — 1st VA, 3rd US (Jun 2024)",
  ],
  phone: "315-882-6569",
};

// ---------- Small utilities ----------
const cx = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(" ");

function useTypewriter(words: string[], speed = 90, pause = 1400) {
  const [index, setIndex] = useState(0);
  const [subindex, setSubindex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const blinkInt = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(blinkInt);
  }, []);

  useEffect(() => {
    if (!words.length) return;

    if (subindex === words[index].length + 1 && !deleting) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }

    if (subindex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => setSubindex((prev) => prev + (deleting ? -1 : 1)),
      deleting ? speed / 2 : speed
    );
    return () => clearTimeout(timeout);
  }, [subindex, index, deleting, words, speed, pause]);

  return {
    text: words.length ? words[index].substring(0, subindex) : "",
    cursor: blink ? "|" : " ",
  };
}

// ---------- Atoms ----------
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium leading-none">
      {children}
    </span>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-2xl border p-5 shadow-sm transition hover:shadow hover:bg-blue-200 hover:text-black", className)}>
      {children}
    </div>
  );
}

// ---------- Page ----------
export default function Site() {
  const { text, cursor } = useTypewriter(DATA.subtitleCycle, 75, 1200);

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24">
      {/* Header / Nav */}



      
      {/* Hero */}
      <section className="relative grid gap-6 py-16 sm:grid-cols-3 sm:items-center">
        <div className="sm:col-span-2">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {DATA.name}
          </h1>
          <p className="mt-2 text-lg opacity-90">
            <span className="font-medium">{text}</span>
            <span className="ml-1 opacity-60">{cursor}</span>
          </p>
          <p className="mt-4 max-w-2xl opacity-80">{DATA.bio}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={DATA.cta.resumeHref}
              className="rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm hover:shadow hover:bg-blue-200 hover:text-black"
            >
              Download Résumé
            </Link>
            <Link
              href={DATA.cta.email}
              className="rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm hover:shadow hover:bg-blue-200 hover:text-black"
            >
              {DATA.cta.email.replace("mailto:", "")}
            </Link>
            <a
              href={DATA.cta.phone}
              className="rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm hover:shadow hover:bg-blue-200 hover:text-blacks"
            >
              {DATA.phone ?? DATA.cta.phone}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {DATA.socials.map((s) => (
              <Link key={s.label} href={s.href} className="text-sm underline-offset-4 hover:underline">
                {s.label}
              </Link>
            ))}
          </div>
        </div>
          <div className="flex aspect-square items-center justify-center p-0 overflow-hidden border border-blue-200 rounded-2xl">
            <img
              src="./me.jpg"
              alt="Profile"
              className="w-full h-full object-cover m-0 rounded-2xl"
              style={{ margin: 0 }}
            />
          </div>
            </section>

      {/* About */}
      <section id="about" className="space-y-4 py-8">
        <SectionHeading id="about">About</SectionHeading>
        <p className="max-w-3xl leading-relaxed opacity-90">
          {DATA.bio} A few quick highlights: I work across web, robotics, and game engines; I prototype with Unity + Arduino and ship full-stack React + FastAPI services.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {DATA.skills.map((sk) => (
            <Tag key={sk}>{sk}</Tag>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-8">
        <SectionHeading id="projects">Projects</SectionHeading>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {DATA.projects.map((p) => (
            <Card key={p.title}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm opacity-80">{p.blurb}</p>
                </div>
                <Link href={p.href} className="rounded-lg border px-3 py-1 text-xs font-semibold hover:shadow">
                  View
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-8">
        <SectionHeading id="experience">Experience</SectionHeading>
        <ol className="mt-5 space-y-6 border-l pl-6">
          {DATA.experience.map((e) => (
            <li key={e.role} className="relative">
              <span className="absolute -left-[px] top-1 h-4 w-4 rounded-full border bg-white dark:bg-neutral-950" />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="text-base font-semibold ml-5">
                  {e.role} · <span className="opacity-90">{e.org}</span>
                </div>
                <div className="text-sm opacity-70">{e.period}</div>
              </div>
              <ul className="mt-2 list-disc pl-5 text-sm opacity-90">
                {e.points.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* Education & Awards */}
      <section id="education" className="py-8">
        <SectionHeading id="education">Education & Awards</SectionHeading>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <h3 className="text-base font-semibold">Education</h3>
            <ul className="mt-2 list-disc pl-5 text-sm opacity-90">
              {DATA.education.map((ed) => (
                <li key={ed.institution}>
                  <strong>{ed.institution}</strong> — <span className="opacity-80">{ed.details}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-base font-semibold">Awards & Activities</h3>
            <ul className="mt-2 list-disc pl-5 text-sm opacity-90">
              {DATA.awards.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Writing */}
      <section id="writing" className="py-8">
        <SectionHeading id="writing">Writing</SectionHeading>
        <div className="mt-4 divide-y rounded-2xl border">
          {DATA.writing.map((w) => (
            <article key={w.title} className="flex items-center justify-between gap-4 p-4">
              <div>
                <h3 className="text-base font-semibold">
                  <Link href={w.href} className="underline-offset-4 hover:underline">
                    {w.title}
                  </Link>
                </h3>
                <p className="text-sm opacity-70">{w.date}</p>
              </div>
              <Link href={w.href} className="rounded-lg border px-3 py-1 text-xs font-semibold hover:shadow">
                Read
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-8">
        <SectionHeading id="contact">Contact</SectionHeading>
        <Card className="mt-4 flex flex-col items-center gap-3 text-center">
          <p className="max-w-2xl opacity-90">
            Want to collaborate, demo a prototype, or chat about game + robotics projects? I read every message.
          </p>
          <div className="flex gap-3">
            <Link
              href={DATA.cta.email}
              className="rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm hover:shadow"
            >
              {DATA.cta.email.replace("mailto:", "")}
            </Link>
            <Link
              href={DATA.cta.resumeHref}
              className="rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm hover:shadow"
            >
              Download Résumé
            </Link>
          </div>
        </Card>
      </section>




      {/* Footer */}
      <footer className="mt-16 border-t py-6 text-center text-xs opacity-70">
        <p>© {new Date().getFullYear()} {DATA.name}. Built with Next.js & Tailwind.</p>
      </footer>
    </main>
  );
}
