"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Playful portfolio with Sequoia-inspired design
 * Inter + Crimson Pro fonts, light tan aesthetic
 * Fun animations and vibrant colors
 */

// ---------- Site Data ----------
const DATA = {
  name: "Nyan Prakash",
  location: "Washington, D.C.",
  tagline: "Building the future, one prototype at a time.",
  bio:
    "I design and build full-stack systems, game & robotics prototypes, and AI tools. I thrive on shipping fast, learning new stacks, and solving real-world problems with technology.",
  cta: {
    resumeHref: "/resume.pdf",
    email: "mailto:nyanjprakash@gmail.com",
    phone: "tel:315-882-6569",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/Nyan-Prakash" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/nyan-prakash" },
    { label: "Twitter", href: "https://twitter.com/nyanprakash" },
    { label: "Website", href: "https://nyanprakash.com" },
  ],
  projects: [
    {
      title: "EcoCoin",
      subtitle: "Decentralized Emissions Trading",
      description:
        "Blockchain-based trading platform for emission allowances featuring a predictive carbon-price algorithm.",
      tags: ["React", "FastAPI", "Firebase", "Blockchain", "ML"],
      href: "https://github.com/ShaunakS05/EcoCoin",
    },
    {
      title: "HealthScope",
      subtitle: "Geospatial Public Health Analytics",
      description:
        "ML platform to predict and visualize public health trends with an interactive React dashboard powered by PyTorch.",
      tags: ["React", "PyTorch", "GIS", "DataViz"],
      href: "https://github.com/Nyan-Prakash/HealthScope",
    },
    {
      title: "Plately",
      subtitle: "AI Menu Optimization",
      description:
        "Agent-based model for restaurant menu optimization using Mesa + FastAPI for dynamic pricing recommendations.",
      tags: ["React", "Mesa", "FastAPI", "ABM"],
      href: "https://github.com/ShaunakS05/Plately",
    },
    {
      title: "DeepGuard",
      subtitle: "Multimodal Deepfake Detection",
      description:
        "Real-time deepfake detection across text, voice, and video with FastAPI backend and multimodal ML scoring.",
      tags: ["Python", "FastAPI", "ML", "Security"],
      href: "https://github.com/ShaunakS05/DeepGuard",
    },
  ],
  experience: [
    {
      role: "Software Engineer Intern",
      company: "The Outpost",
      period: "May 2025 — Aug 2025",
      description: [
        "Built market research tool for web scraping and startup discovery",
        "Developed productivity tools for sales and account management teams",
        "Created internal agent for automated meeting preparation",
      ],
    },
    {
      role: "Undergraduate Research Assistant",
      company: "UVA Link Lab",
      period: "Nov 2024 — May 2025",
      description: [
        "Optimized urban roads for bike and e-scooter safety using data-driven trials",
        "Developed Unity/C# simulation integrating real-world bike telemetry",
      ],
    },
    {
      role: "Software Engineering Intern",
      company: "Pacific Northwest National Laboratory",
      period: "May 2024 — Aug 2024",
      description: [
        "Built DOE website for national security funding allocation",
        "Reduced bundle size by 50% via React code-splitting and .NET backend optimization",
      ],
    },
    {
      role: "Founder",
      company: "AutoDog",
      period: "Dec 2023 — Jun 2024",
      description: [
        "Created smart dog harness using Arduino and BLE for automated training",
        "Won 1st in Virginia and 3rd nationally in SkillsUSA Engineering Technology & Design",
      ],
    },
    {
      role: "Programming Captain",
      company: "Gryphon Robotics 5549",
      period: "Sept 2021 — Jun 2023",
      description: [
        "Led 20-member team to design and build custom robot for FIRST Robotics Competition",
        "Mentored 15+ students in Java programming and robotics",
      ],
    },
  ],
  education: [
    {
      school: "Fractal Tech Bootcamp",
      degree: "12-week AI startup bootcamp",
      year: "2024",
    },
    {
      school: "University of Virginia",
      degree: "B.S. Computer Science & Economics",
      year: "(on leave)",
    },
    {
      school: "Northern Virginia Community College",
      degree: "A.S. Engineering • GPA: 3.9/4.0",
      year: "2023 — 2024",
    },
  ],
  skills: [
    "TypeScript", "React", "Node.js", "Python", "Unity", "C#",
    "TensorFlow", "PyTorch", "Arduino", "Raspberry Pi",
    "Docker", "GCP", "AWS", "FastAPI", "GIS", "Blockchain",
  ],
  awards: [
    "HackNYU — 2nd place Best Fintech Hack (Feb 2025)",
    "HopHacks — 3rd place Best Use of Data (Oct 2024)",
    "SkillsUSA Engineering Technology & Design — 1st VA, 3rd US (Jun 2024)",
  ],
};

// ---------- Utilities ----------
const cx = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(" ");

function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return { ref, isVisible };
}

// ---------- Components ----------

function HandDrawnText({ children }: { children: string }) {
  return (
    <span className="hand-drawn-underline">
      {children}
      <svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        {/* Single hand-drawn circle around text */}
        <path d="M 12,58
                 C 8,32 18,18 65,12
                 C 125,5 210,6 295,10
                 C 375,14 440,22 475,40
                 C 495,52 500,68 496,86
                 C 492,102 478,112 435,115
                 C 370,118 270,120 170,116
                 C 95,113 35,107 16,92
                 C 6,84 4,70 12,58 Z"
              fill="none" />
      </svg>
    </span>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  const colors = [
    { bg: 'var(--primary-light)', text: 'var(--primary-dark)' },
    { bg: 'var(--secondary-light)', text: 'var(--secondary-dark)' },
    { bg: '#e8f5e9', text: '#2e7d32' },
    { bg: '#fff3e0', text: '#e65100' },
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <span
      className="inline-block rounded-full px-3 py-1 transition-all hover:scale-110 hover:rotate-2"
      style={{
        backgroundColor: randomColor.bg,
        color: randomColor.text,
        fontSize: 'var(--font-size-tiny)',
        fontWeight: 600,
        transitionDuration: 'var(--transition-bounce)'
      }}
    >
      {children}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <h2
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={cx("font-semibold tracking-tight opacity-0", isVisible && "animate-fade-in-up opacity-100")}
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--font-size-h2)',
        lineHeight: 'var(--line-height-tight)',
        color: 'var(--foreground)',
        marginBottom: 'var(--spacing-xl)'
      }}
    >
      {children}
    </h2>
  );
}

function Card({ children, delay = 0, playful = false }: { children: React.ReactNode; delay?: number; playful?: boolean }) {
  const { ref, isVisible } = useScrollAnimation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cx("card-interactive rounded-xl border transition-all opacity-0 relative", isVisible && "animate-fade-in-up opacity-100")}
      style={{
        borderColor: isHovered && playful ? 'var(--primary)' : 'var(--gray-300)',
        backgroundColor: 'var(--surface)',
        padding: 'var(--spacing-xl)',
        animationDelay: `${delay}ms`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        transitionDuration: 'var(--transition-slow)'
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        if (playful) {
          e.currentTarget.style.transform = 'translateY(-4px) rotate(1deg)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 179, 66, 0.15)';
        } else {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 142, 78, 0.08)';
        }
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
      }}
    >
      {children}
    </div>
  );
}

// ---------- Main Component ----------
export default function Site() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <main className="mx-auto max-w-7xl" style={{ padding: '0 3rem 4rem' }}>

      {/* Hero Section */}
      <section
        className="opacity-0"
        style={{
          paddingTop: 'var(--spacing-xl)',
          paddingBottom: 'var(--spacing-4xl)',
          minHeight: 'calc(100vh - 100px)',
          display: 'flex',
          alignItems: 'center',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.8s ease-out'
        }}
      >
        <div className="w-full grid md:grid-cols-[1.2fr_1fr] gap-16 items-center">
          {/* Left: Text */}
          <div className="order-2 md:order-1">
            <h1
              className="font-bold tracking-tight"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--font-size-hero)',
                lineHeight: 'var(--line-height-tight)',
                marginBottom: 'var(--spacing-xl)'
              }}
            >
              Hi, I'm <HandDrawnText>Nyan Prakash</HandDrawnText>
            </h1>
            <p
              className="font-medium"
              style={{
                fontSize: 'var(--font-size-h3)',
                lineHeight: 'var(--line-height-snug)',
                color: 'var(--foreground)',
                marginBottom: 'var(--spacing-lg)'
              }}
            >
              {DATA.tagline}
            </p>
            <p
              style={{
                fontSize: 'var(--font-size-body)',
                lineHeight: 'var(--line-height-relaxed)',
                color: 'var(--gray-600)',
                marginBottom: 'var(--spacing-2xl)',
                maxWidth: '600px'
              }}
            >
              {DATA.bio}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href={DATA.cta.email}
                className="btn-primary rounded-lg px-8 py-3 font-medium transition-all relative"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  fontSize: 'var(--font-size-small)',
                  transitionDuration: 'var(--transition-base)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Get in Touch
              </Link>
              <Link
                href={DATA.cta.resumeHref}
                className="btn-primary rounded-lg border-2 px-8 py-3 font-medium transition-all relative"
                style={{
                  borderColor: 'var(--gray-300)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--font-size-small)',
                  transitionDuration: 'var(--transition-base)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gray-300)';
                  e.currentTarget.style.color = 'var(--foreground)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                View Resume
              </Link>
            </div>

            <div className="flex gap-6" style={{ marginTop: 'var(--spacing-xl)' }}>
              {DATA.socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="link-underline transition-colors relative"
                  style={{
                    fontSize: 'var(--font-size-small)',
                    color: 'var(--gray-500)',
                    transitionDuration: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-500)'; }}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Photo */}
          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative" style={{ padding: '80px 40px 40px' }}>
              {/* Photo */}
              <div
                className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-2xl overflow-visible shadow-2x group"
                style={{
                  border: '4px solid var(--primary)',
                  transitionDuration: 'var(--transition-slow)'
                }}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src={`${basePath}/me.jpg`}
                    alt="Nyan Prakash"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 320px, 384px"
                  />
                </div>

                {/* Hand-drawn top hat - 2D side view with scribbled fill */}
                <svg
                  className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-hat-svg"
                  style={{
                    top: '-20px',
                    left: '55%',
                    transform: 'translateX(-50%)',
                    width: '140px',
                    height: '120px',
                    overflow: 'visible'
                  }}
                  viewBox="0 0 140 120"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Scribbled fill for crown */}
                  <g className="hat-fill">
                    <line x1="42" y1="92" x2="45" y2="28" stroke="var(--primary-dark)" strokeWidth="5" />
                    <line x1="46" y1="91" x2="49" y2="29" stroke="var(--primary-dark)" strokeWidth="5" />
                    <line x1="50" y1="92" x2="53" y2="28" stroke="var(--primary-dark)" strokeWidth="5" />
                    <line x1="54" y1="91" x2="57" y2="29" stroke="var(--primary-dark)" strokeWidth="5" />
                    <line x1="58" y1="92" x2="61" y2="28" stroke="var(--primary-dark)" strokeWidth="5" />
                    <line x1="62" y1="91" x2="65" y2="29" stroke="var(--primary-dark)" strokeWidth="5" />
                    <line x1="66" y1="92" x2="69" y2="28" stroke="var(--primary-dark)" strokeWidth="5" />
                    <line x1="70" y1="91" x2="73" y2="29" stroke="var(--primary-dark)" strokeWidth="5" />
                    <line x1="74" y1="92" x2="77" y2="28" stroke="var(--primary-dark)" strokeWidth="5" />
                    <line x1="78" y1="91" x2="81" y2="29" stroke="var(--primary-dark)" strokeWidth="5" />
                    <line x1="82" y1="92" x2="85" y2="28" stroke="var(--primary-dark)" strokeWidth="5" />
                    <line x1="86" y1="91" x2="89" y2="29" stroke="var(--primary-dark)" strokeWidth="5" />
                    <line x1="90" y1="92" x2="93" y2="28" stroke="var(--primary-dark)" strokeWidth="5" />
                    <line x1="94" y1="91" x2="97" y2="29" stroke="var(--primary-dark)" strokeWidth="5" />
                  </g>

                  {/* Wide brim - hand-drawn wavy line */}
                  <path
                    className="hat-outline"
                    d="M 10,95 Q 30,93 50,94 Q 70,95 90,94 Q 110,93 130,95"
                    fill="none"
                    stroke="var(--primary-dark)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: '1000',
                      strokeDashoffset: '1000',
                      animationDelay: '0s'
                    }}
                  />
                  
                  {/* Brim thickness - bottom edge with slight wobble */}
                  <path
                    className="hat-outline"
                    d="M 12,100 Q 35,101 55,100 Q 75,99 95,100 Q 115,101 128,100"
                    fill="none"
                    stroke="var(--primary-dark)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: '1000',
                      strokeDashoffset: '1000',
                      animationDelay: '0.1s'
                    }}
                  />
                  
                  {/* Left side of crown - slightly curved */}
                  <path
                    className="hat-outline"
                    d="M 40,95 Q 39,80 40,65 Q 41,50 39,35 Q 40,30 40,25"
                    fill="none"
                    stroke="var(--primary-dark)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: '1000',
                      strokeDashoffset: '1000',
                      animationDelay: '0.2s'
                    }}
                  />
                  
                  {/* Right side of crown - slightly curved opposite direction */}
                  <path
                    className="hat-outline"
                    d="M 100,95 Q 101,80 100,65 Q 99,50 101,35 Q 100,30 100,25"
                    fill="none"
                    stroke="var(--primary-dark)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: '1000',
                      strokeDashoffset: '1000',
                      animationDelay: '0.25s'
                    }}
                  />
                  
                  {/* Top of crown - slight wave */}
                  <path
                    className="hat-outline"
                    d="M 40,25 Q 55,24 70,25 Q 85,26 100,25"
                    fill="none"
                    stroke="var(--primary-dark)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: '1000',
                      strokeDashoffset: '1000',
                      animationDelay: '0.35s'
                    }}
                  />
                  
                  {/* Hatband top - wavy */}
                  <path
                    className="hat-outline"
                    d="M 40,70 Q 55,69 70,70 Q 85,71 100,70"
                    fill="none"
                    stroke="var(--primary-dark)"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: '1000',
                      strokeDashoffset: '1000',
                      animationDelay: '0.45s'
                    }}
                  />
                  
                  {/* Hatband bottom - wavy */}
                  <path
                    className="hat-outline"
                    d="M 40,78 Q 55,79 70,78 Q 85,77 100,78"
                    fill="none"
                    stroke="var(--primary-dark)"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: '1000',
                      strokeDashoffset: '1000',
                      animationDelay: '0.5s'
                    }}
                  />
                </svg>

                {/* Hand-drawn monocle */}
                <svg
                  className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-hat-svg"
                  style={{
                    top: '30%',
                    right: '44%',
                    width: '80px',
                    height: '100px',
                    overflow: 'visible'
                  }}
                  viewBox="0 0 80 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Monocle chain/string - hangs down naturally with a bigger loop */}
                  <path
                    className="hat-outline"
                    d="M 40,25 L 40,30 Q 40,35 38,40 Q 36,45 35,50 Q 34,58 30,64 Q 25,70 18,70 Q 11,70 8,64 Q 5,58 7,52 Q 9,46 13,42 Q 17,38 22,36 Q 27,34 32,34 Q 36,34 38,32"
                    fill="none"
                    stroke="var(--primary-dark)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: '1000',
                      strokeDashoffset: '1000',
                      animationDelay: '0.3s'
                    }}
                  />
                  
                  {/* Monocle lens fill - subtle tint */}
                  <path
                    className="hat-fill"
                    d="M 50,25 Q 50,30 48,34 Q 44,38 40,38 Q 36,38 32,34 Q 30,30 30,25 Q 30,20 32,16 Q 36,12 40,12 Q 44,12 48,16 Q 50,20 50,25"
                    fill="var(--primary-dark)"
                    opacity="0.1"
                    stroke="none"
                  />
                  
                  {/* Monocle rim - hand-drawn imperfect circle, smaller */}
                  <path
                    className="hat-outline"
                    d="M 50,25 Q 50,30 48,34 Q 44,38 40,38 Q 36,38 32,34 Q 30,30 30,25 Q 30,20 32,16 Q 36,12 40,12 Q 44,12 48,16 Q 50,20 50,25"
                    fill="none"
                    stroke="var(--primary-dark)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: '1000',
                      strokeDashoffset: '1000',
                      animationDelay: '0.35s'
                    }}
                  />
                  
                  {/* Small lens glare - simple curved line */}
                  <path
                    className="hat-fill"
                    d="M 35,18 Q 37,16 39,17"
                    stroke="var(--primary-dark)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
        <SectionHeading>Featured Projects</SectionHeading>
        <div className="grid gap-6 sm:grid-cols-2">
          {DATA.projects.map((project, i) => (
            <Card key={project.title} delay={i * 80} playful={true}>
              <h3
                className="font-semibold transition-colors"
                style={{
                  fontSize: 'var(--font-size-h3)',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--foreground)',
                  transitionDuration: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--foreground)'; }}
              >
                {project.title}
              </h3>
              <p
                className="opacity-60"
                style={{
                  fontSize: 'var(--font-size-small)',
                  marginBottom: 'var(--spacing-md)'
                }}
              >
                {project.subtitle}
              </p>
              <p
                className="opacity-80"
                style={{
                  fontSize: 'var(--font-size-body)',
                  lineHeight: 'var(--line-height-relaxed)',
                  marginBottom: 'var(--spacing-lg)'
                }}
              >
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2" style={{ marginBottom: 'var(--spacing-md)' }}>
                {project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
              </div>
              <Link
                href={project.href}
                className="link-underline inline-flex items-center gap-1 font-medium transition-colors relative"
                style={{
                  fontSize: 'var(--font-size-small)',
                  color: 'var(--primary)',
                  transitionDuration: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary-dark)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
              >
                View Project <span>→</span>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
        <SectionHeading>Experience</SectionHeading>
        <div className="space-y-8">
          {DATA.experience.map((exp, i) => {
            const { ref, isVisible } = useScrollAnimation();
            return (
              <div
                key={exp.role}
                ref={ref as React.RefObject<HTMLDivElement>}
                className={cx("border-l-2 pl-6 opacity-0", isVisible && "animate-fade-in-up opacity-100")}
                style={{
                  borderColor: 'var(--primary)',
                  animationDelay: `${i * 60}ms`
                }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2" style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <h3 className="font-semibold" style={{ fontSize: 'var(--font-size-h3)' }}>
                    {exp.role}
                  </h3>
                  <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--gray-500)' }}>
                    {exp.period}
                  </span>
                </div>
                <p className="font-medium" style={{ fontSize: 'var(--font-size-body)', color: 'var(--primary)', marginBottom: 'var(--spacing-sm)' }}>
                  {exp.company}
                </p>
                <ul className="space-y-2">
                  {exp.description.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex gap-2 transition-all hover:translate-x-1"
                      style={{
                        fontSize: 'var(--font-size-body)',
                        color: 'var(--gray-600)',
                        lineHeight: 'var(--line-height-relaxed)',
                        transitionDuration: 'var(--transition-fast)'
                      }}
                    >
                      <span style={{ color: 'var(--primary)', fontSize: '1.2em' }}>✦</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Education & Skills */}
      <section id="about" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
        <SectionHeading>Education & Skills</SectionHeading>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card delay={0}>
            <h3 className="font-semibold" style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--spacing-lg)', color: 'var(--primary)' }}>
              Education
            </h3>
            <div className="space-y-4">
              {DATA.education.map((edu) => (
                <div key={edu.school}>
                  <p className="font-semibold" style={{ fontSize: 'var(--font-size-body)' }}>{edu.school}</p>
                  <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--gray-600)' }}>{edu.degree}</p>
                  <p style={{ fontSize: 'var(--font-size-tiny)', color: 'var(--gray-500)' }}>{edu.year}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card delay={100}>
            <h3 className="font-semibold" style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--spacing-lg)', color: 'var(--secondary-dark)' }}>
              Awards
            </h3>
            <div className="space-y-3">
              {DATA.awards.map((award) => (
                <p key={award} className="flex gap-2" style={{ fontSize: 'var(--font-size-small)', color: 'var(--gray-600)' }}>
                  <span style={{ color: 'var(--secondary)' }}>•</span>
                  <span>{award}</span>
                </p>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <h3 className="font-semibold opacity-60" style={{ fontSize: 'var(--font-size-small)', marginBottom: 'var(--spacing-md)', letterSpacing: '0.05em' }}>
            TECHNICAL SKILLS
          </h3>
          <div className="flex flex-wrap gap-2">
            {DATA.skills.map((skill) => <Tag key={skill}>{skill}</Tag>)}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        <Card delay={0} playful={true}>
          <div className="text-center space-y-6">
            <h2
              className="font-semibold transition-transform hover:animate-wiggle"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--font-size-h2)',
                lineHeight: 'var(--line-height-tight)'
              }}
            >
              Let's Work Together
            </h2>
            <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--gray-600)', lineHeight: 'var(--line-height-relaxed)' }}>
              Interested in collaborating or want to chat about robotics, AI, or prototyping? I'm always open to new opportunities.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href={DATA.cta.email}
                className="btn-primary rounded-lg px-6 py-2.5 font-medium transition-all relative"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  fontSize: 'var(--font-size-small)',
                  transitionDuration: 'var(--transition-base)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                }}
              >
                {DATA.cta.email.replace("mailto:", "")}
              </Link>
              <Link
                href={DATA.cta.resumeHref}
                className="btn-primary rounded-lg border px-6 py-2.5 font-medium transition-all relative"
                style={{
                  borderColor: 'var(--secondary-dark)',
                  color: 'var(--secondary-dark)',
                  fontSize: 'var(--font-size-small)',
                  transitionDuration: 'var(--transition-base)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--secondary-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Download Resume
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t text-center" style={{ marginTop: 'var(--spacing-3xl)', paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)', borderColor: 'var(--gray-200)' }}>
        <p style={{ fontSize: 'var(--font-size-small)', color: 'var(--gray-500)' }}>
          © {new Date().getFullYear()} {DATA.name}. Built with Next.js & Tailwind CSS
        </p>
        <div className="flex gap-4 justify-center items-center" style={{ marginTop: 'var(--spacing-sm)' }}>
          {DATA.socials.map((social, idx) => (
            <Link
              key={social.label}
              href={social.href}
              className="transition-all hover:scale-110"
              style={{
                fontSize: 'var(--font-size-tiny)',
                color: 'var(--gray-400)',
                transitionDuration: 'var(--transition-bounce)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = idx % 2 === 0 ? 'var(--primary)' : 'var(--secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--gray-400)';
              }}
            >
              {social.label}
            </Link>
          ))}
        </div>
      </footer>
    </main>
  );
}
