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
    calendarly: "https://calendly.com/nyanjprakash/30min",
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

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
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

// ---------- Hand-Drawn Effects ----------

// Define different hand-drawn accessories
const HAND_DRAWN_EFFECTS = [
  // Effect 1: Top hat and monocle
  {
    id: 'tophat-monocle',
    elements: [
      {
        type: 'svg',
        style: {
          top: '-20px',
          left: '55%',
          transform: 'translateX(-50%)',
          width: '140px',
          height: '120px',
        },
        viewBox: '0 0 140 120',
        paths: [
          // Scribbled fill for crown
          { type: 'group', className: 'hat-fill', children: [
            { type: 'line', x1: 42, y1: 92, x2: 45, y2: 28, strokeWidth: 5 },
            { type: 'line', x1: 46, y1: 91, x2: 49, y2: 29, strokeWidth: 5 },
            { type: 'line', x1: 50, y1: 92, x2: 53, y2: 28, strokeWidth: 5 },
            { type: 'line', x1: 54, y1: 91, x2: 57, y2: 29, strokeWidth: 5 },
            { type: 'line', x1: 58, y1: 92, x2: 61, y2: 28, strokeWidth: 5 },
            { type: 'line', x1: 62, y1: 91, x2: 65, y2: 29, strokeWidth: 5 },
            { type: 'line', x1: 66, y1: 92, x2: 69, y2: 28, strokeWidth: 5 },
            { type: 'line', x1: 70, y1: 91, x2: 73, y2: 29, strokeWidth: 5 },
            { type: 'line', x1: 74, y1: 92, x2: 77, y2: 28, strokeWidth: 5 },
            { type: 'line', x1: 78, y1: 91, x2: 81, y2: 29, strokeWidth: 5 },
            { type: 'line', x1: 82, y1: 92, x2: 85, y2: 28, strokeWidth: 5 },
            { type: 'line', x1: 86, y1: 91, x2: 89, y2: 29, strokeWidth: 5 },
            { type: 'line', x1: 90, y1: 92, x2: 93, y2: 28, strokeWidth: 5 },
            { type: 'line', x1: 94, y1: 91, x2: 97, y2: 29, strokeWidth: 5 },
          ]},
          // Brim
          { type: 'path', className: 'hat-outline', d: 'M 10,95 Q 30,93 50,94 Q 70,95 90,94 Q 110,93 130,95', strokeWidth: 5, delay: '0s' },
          { type: 'path', className: 'hat-outline', d: 'M 12,100 Q 35,101 55,100 Q 75,99 95,100 Q 115,101 128,100', strokeWidth: 5, delay: '0.1s' },
          // Crown sides
          { type: 'path', className: 'hat-outline', d: 'M 40,95 Q 39,80 40,65 Q 41,50 39,35 Q 40,30 40,25', strokeWidth: 5, delay: '0.2s' },
          { type: 'path', className: 'hat-outline', d: 'M 100,95 Q 101,80 100,65 Q 99,50 101,35 Q 100,30 100,25', strokeWidth: 5, delay: '0.25s' },
          // Crown top
          { type: 'path', className: 'hat-outline', d: 'M 40,25 Q 55,24 70,25 Q 85,26 100,25', strokeWidth: 5, delay: '0.35s' },
          // Hatband
          { type: 'path', className: 'hat-outline', d: 'M 40,70 Q 55,69 70,70 Q 85,71 100,70', strokeWidth: 4.5, delay: '0.45s' },
          { type: 'path', className: 'hat-outline', d: 'M 40,78 Q 55,79 70,78 Q 85,77 100,78', strokeWidth: 4.5, delay: '0.5s' },
        ]
      },
      {
        type: 'svg',
        style: {
          top: '30%',
          right: '44%',
          width: '80px',
          height: '100px',
        },
        viewBox: '0 0 80 100',
        paths: [
          // Monocle chain
          // Lens fill
          { type: 'path', className: 'hat-fill', d: 'M 50,25 Q 50,30 48,34 Q 44,38 40,38 Q 36,38 32,34 Q 30,30 30,25 Q 30,20 32,16 Q 36,12 40,12 Q 44,12 48,16 Q 50,20 50,25', fill: 'var(--primary-dark)', opacity: 0.1, strokeWidth: 0 },
          // Rim
          { type: 'path', className: 'hat-outline', d: 'M 50,25 Q 50,30 48,34 Q 44,38 40,38 Q 36,38 32,34 Q 30,30 30,25 Q 30,20 32,16 Q 36,12 40,12 Q 44,12 48,16 Q 50,20 50,25', strokeWidth: 3.5, delay: '0.35s' },
          // Glare
          { type: 'path', className: 'hat-fill', d: 'M 35,18 Q 37,16 39,17', strokeWidth: 2 },
        ]
      }
    ]
  },
  // Effect 2: Sunglasses
  {
    id: 'sunglasses',
    elements: [
      {
        type: 'svg',
        style: {
          top: '31%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '110px',
          height: '50px',
        },
        viewBox: '0 0 110 50',
        paths: [
  // Left lens fill - unchanged
  {
    type: 'path',
    className: 'hat-fill',
    d: 'M 25,25 Q 25,18 29,14 Q 33,11 37,13 Q 41,15 42,20 Q 43,25 42,30 Q 41,34 37,36 Q 33,38 29,35 Q 25,31 25,25',
    fill: 'var(--primary-dark)',
    opacity: 0.4,
    strokeWidth: 0,
  },
  // Left lens frame - unchanged
  {
    type: 'path',
    className: 'hat-outline',
    d: 'M 25,25 Q 25,18 29,14 Q 33,11 37,13 Q 41,15 42,20 Q 43,25 42,30 Q 41,34 37,36 Q 33,38 29,35 Q 25,31 25,25',
    strokeWidth: 3.5,
    delay: '0s',
  },

  // Right lens fill - moved left (lenses closer)
  {
    type: 'path',
    className: 'hat-fill',
    d: 'M 52,25 Q 52,18 56,14 Q 60,11 64,13 Q 68,15 69,20 Q 70,25 69,30 Q 68,34 64,36 Q 60,38 56,35 Q 52,31 52,25',
    fill: 'var(--primary-dark)',
    opacity: 0.4,
    strokeWidth: 0,
  },
  // Right lens frame - moved left (lenses closer)
  {
    type: 'path',
    className: 'hat-outline',
    d: 'M 52,25 Q 52,18 56,14 Q 60,11 64,13 Q 68,15 69,20 Q 70,25 69,30 Q 68,34 64,36 Q 60,38 56,35 Q 52,31 52,25',
    strokeWidth: 3.5,
    delay: '0.1s',
  },

  // Bridge connecting the lenses - shorter and more compact
  {
    type: 'path',
    className: 'hat-outline',
    d: 'M 42,23 Q 47,21 52,23',
    strokeWidth: 2,
    delay: '0.15s',
  },

  // Left temple/arm - unchanged
  {
    type: 'path',
    className: 'hat-outline',
    d: 'M 25,23 Q 20,23 15,24 Q 12,25 10,26',
    strokeWidth: 2.5,
    delay: '0.2s',
  },
  // Right temple/arm - moved with right lens
  {
    type: 'path',
    className: 'hat-outline',
    d: 'M 69,23 Q 74,23 79,24 Q 82,25 84,26',
    strokeWidth: 2.5,
    delay: '0.25s',
  },

  // Lens details/reflections
  { 
    type: 'path',
    className: 'hat-fill',
    d: 'M 30,18 Q 32,16 34,17',
    strokeWidth: 2,
    opacity: 0.6,
  },
  { 
    type: 'path',
    className: 'hat-fill',
    d: 'M 60,18 Q 62,16 64,17',
    strokeWidth: 2,
    opacity: 0.6,
  },
]

      }
    ]
  },
  // Effect 3: Party hat
  {
    id: 'party-hat',
    elements: [
      {
        type: 'svg',
        style: {
          top: '-15px',
          left: '52%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '110px',
        },
        viewBox: '0 0 100 110',
        paths: [
          // Hat fill
          // Hat outline
          { type: 'path', className: 'hat-outline', d: 'M 20,90 Q 25,88 30,87 Q 40,85 50,15 Q 60,85 70,87 Q 75,88 80,90', strokeWidth: 4, delay: '0s' },
          // Bottom trim
          { type: 'path', className: 'hat-outline', d: 'M 18,90 Q 30,92 50,92 Q 70,92 82,90', strokeWidth: 3.5, delay: '0.1s' },
          // Decorative dots
          { type: 'circle', className: 'hat-fill', cx: 35, cy: 50, r: 3, fill: 'var(--primary)' },
          { type: 'circle', className: 'hat-fill', cx: 50, cy: 40, r: 3, fill: 'var(--secondary-dark)' },
          { type: 'circle', className: 'hat-fill', cx: 65, cy: 55, r: 3, fill: 'var(--primary)' },
          // Pom-pom
          { type: 'circle', className: 'hat-outline', cx: 50, cy: 12, r: 5, strokeWidth: 3, delay: '0.2s' },
        ]
      }
    ]
  },
  // Effect 4: Mustache
  {
    id: 'mustache',
    elements: [
      {
        type: 'svg',
        style: {
          top: '39%',
          left: '44%',
          transform: 'translateX(-50%)',
          width: '140px',
          height: '50px',
        },
        viewBox: '0 0 140 50',
        paths: [
          // Left mustache fill
          { type: 'path', className: 'hat-fill', d: 'M 70,25 Q 65,20 58,18 Q 50,16 42,18 Q 35,20 28,25 Q 22,30 18,35 Q 15,40 12,42 Q 10,43 8,42 Q 6,40 8,38 Q 12,34 18,28 Q 25,22 35,20 Q 45,18 55,22 Q 62,25 68,28', fill: 'var(--primary-dark)', opacity: 0.7, strokeWidth: 0 },
          // Left mustache outline - curls up at the end
          { type: 'path', className: 'hat-outline', d: 'M 70,25 Q 65,20 58,18 Q 50,16 42,18 Q 35,20 28,25 Q 22,30 18,35 Q 15,40 12,42 Q 10,43 8,42 Q 6,40 8,38', strokeWidth: 3.5, delay: '0s' },
          // Left inner detail
          { type: 'path', className: 'hat-outline', d: 'M 68,26 Q 60,23 52,22 Q 45,21 38,24 Q 32,27 28,32', strokeWidth: 2, delay: '0.05s' },
          
          // Right mustache fill
          { type: 'path', className: 'hat-fill', d: 'M 70,25 Q 75,20 82,18 Q 90,16 98,18 Q 105,20 112,25 Q 118,30 122,35 Q 125,40 128,42 Q 130,43 132,42 Q 134,40 132,38 Q 128,34 122,28 Q 115,22 105,20 Q 95,18 85,22 Q 78,25 72,28', fill: 'var(--primary-dark)', opacity: 0.7, strokeWidth: 0 },
          // Right mustache outline - curls up at the end
          { type: 'path', className: 'hat-outline', d: 'M 70,25 Q 75,20 82,18 Q 90,16 98,18 Q 105,20 112,25 Q 118,30 122,35 Q 125,40 128,42 Q 130,43 132,42 Q 134,40 132,38', strokeWidth: 3.5, delay: '0.1s' },
          // Right inner detail
          { type: 'path', className: 'hat-outline', d: 'M 72,26 Q 80,23 88,22 Q 95,21 102,24 Q 108,27 112,32', strokeWidth: 2, delay: '0.15s' },
          
          // Center divot
          { type: 'path', className: 'hat-outline', d: 'M 70,25 Q 70,28 70,30', strokeWidth: 2.5, delay: '0.2s' },
        ]
      }
    ]
  },

  // Effect 8: Crown
  {
    id: 'crown',
    elements: [
      {
        type: 'svg',
        style: {
          top: '5px',
          left: '55%',
          transform: 'translateX(-50%)',
          width: '130px',
          height: '90px',
        },
        viewBox: '0 0 130 90',
        paths: [
          // Crown base
          {
            type: 'path',
            className: 'hat-outline',
            d: 'M 20,65 Q 45,68 65,68 Q 85,68 110,65',
            strokeWidth: 4,
            delay: '0s',
          },
          // Crown spikes
          {
            type: 'path',
            className: 'hat-outline',
            d: 'M 20,65 L 32,35 L 48,60 L 65,30 L 82,60 L 98,35 L 110,65',
            strokeWidth: 4,
            delay: '0.1s',
          },
          // Jewels
          {
            type: 'circle',
            className: 'hat-fill',
            cx: 32,
            cy: 37,
            r: 3,
          },
          {
            type: 'circle',
            className: 'hat-fill',
            cx: 65,
            cy: 32,
            r: 4,
          },
          {
            type: 'circle',
            className: 'hat-fill',
            cx: 98,
            cy: 37,
            r: 3,
          },
          // Slight scribble on base
          {
            type: 'group',
            className: 'hat-fill',
            children: [
              { type: 'line', x1: 30, y1: 63, x2: 45, y2: 64, strokeWidth: 2 },
              { type: 'line', x1: 50, y1: 65, x2: 65, y2: 66, strokeWidth: 2 },
              { type: 'line', x1: 70, y1: 66, x2: 85, y2: 65, strokeWidth: 2 },
            ],
          },
        ],
      },
    ],
  },

  // Effect 6: Bow Tie
  {
    id: 'bow-tie',
    elements: [
      {
        type: 'svg',
        style: {
          top: '60%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '60px',
        },
        viewBox: '0 0 100 60',
        paths: [
          // Left bow side - fill
          {
            type: 'path',
            className: 'hat-fill',
            d: 'M 20,30 Q 15,20 18,15 Q 22,12 28,15 Q 32,18 35,22 Q 38,26 40,30 Q 38,34 35,38 Q 32,42 28,45 Q 22,48 18,45 Q 15,40 20,30',
            fill: 'var(--primary-dark)',
            opacity: 0.5,
            strokeWidth: 0,
          },
          // Left bow side - outline
          {
            type: 'path',
            className: 'hat-outline',
            d: 'M 20,30 Q 15,20 18,15 Q 22,12 28,15 Q 32,18 35,22 Q 38,26 40,30 Q 38,34 35,38 Q 32,42 28,45 Q 22,48 18,45 Q 15,40 20,30',
            strokeWidth: 3,
            delay: '0s',
          },
          // Left bow fold detail
          {
            type: 'path',
            className: 'hat-outline',
            d: 'M 25,22 Q 30,28 28,35',
            strokeWidth: 2,
            delay: '0.05s',
          },

          // Right bow side - fill
          {
            type: 'path',
            className: 'hat-fill',
            d: 'M 80,30 Q 85,20 82,15 Q 78,12 72,15 Q 68,18 65,22 Q 62,26 60,30 Q 62,34 65,38 Q 68,42 72,45 Q 78,48 82,45 Q 85,40 80,30',
            fill: 'var(--primary-dark)',
            opacity: 0.5,
            strokeWidth: 0,
          },
          // Right bow side - outline
          {
            type: 'path',
            className: 'hat-outline',
            d: 'M 80,30 Q 85,20 82,15 Q 78,12 72,15 Q 68,18 65,22 Q 62,26 60,30 Q 62,34 65,38 Q 68,42 72,45 Q 78,48 82,45 Q 85,40 80,30',
            strokeWidth: 3,
            delay: '0.1s',
          },
          // Right bow fold detail
          {
            type: 'path',
            className: 'hat-outline',
            d: 'M 75,22 Q 70,28 72,35',
            strokeWidth: 2,
            delay: '0.15s',
          },

          // Center knot - fill
          {
            type: 'path',
            className: 'hat-fill',
            d: 'M 42,26 Q 44,24 46,24 Q 48,24 50,25 Q 52,26 54,24 Q 56,24 58,26 Q 58,28 58,30 Q 58,32 58,34 Q 56,36 54,36 Q 52,34 50,35 Q 48,36 46,36 Q 44,36 42,34 Q 42,32 42,30 Q 42,28 42,26',
            fill: 'var(--primary-dark)',
            opacity: 0.6,
            strokeWidth: 0,
          },
          // Center knot - outline
          {
            type: 'path',
            className: 'hat-outline',
            d: 'M 42,26 Q 44,24 46,24 Q 48,24 50,25 Q 52,26 54,24 Q 56,24 58,26 Q 58,28 58,30 Q 58,32 58,34 Q 56,36 54,36 Q 52,34 50,35 Q 48,36 46,36 Q 44,36 42,34 Q 42,32 42,30 Q 42,28 42,26',
            strokeWidth: 3,
            delay: '0.2s',
          },
          // Center knot folds
          {
            type: 'path',
            className: 'hat-outline',
            d: 'M 46,27 Q 48,29 50,30 Q 52,31 54,33',
            strokeWidth: 1.5,
            delay: '0.25s',
          },

          // Polka dots on left side
          {
            type: 'circle',
            className: 'hat-fill',
            cx: 25,
            cy: 25,
            r: 2,
            fill: 'var(--secondary-dark)',
            opacity: 0.6,
          },
          {
            type: 'circle',
            className: 'hat-fill',
            cx: 30,
            cy: 32,
            r: 1.5,
            fill: 'var(--secondary-dark)',
            opacity: 0.6,
          },
          {
            type: 'circle',
            className: 'hat-fill',
            cx: 22,
            cy: 36,
            r: 2,
            fill: 'var(--secondary-dark)',
            opacity: 0.6,
          },

          // Polka dots on right side
          {
            type: 'circle',
            className: 'hat-fill',
            cx: 75,
            cy: 25,
            r: 2,
            fill: 'var(--secondary-dark)',
            opacity: 0.6,
          },
          {
            type: 'circle',
            className: 'hat-fill',
            cx: 70,
            cy: 32,
            r: 1.5,
            fill: 'var(--secondary-dark)',
            opacity: 0.6,
          },
          {
            type: 'circle',
            className: 'hat-fill',
            cx: 78,
            cy: 36,
            r: 2,
            fill: 'var(--secondary-dark)',
            opacity: 0.6,
          },

          // Left ribbon end
          {
            type: 'path',
            className: 'hat-outline',
            d: 'M 40,30 Q 38,30 36,31 Q 34,32 32,34',
            strokeWidth: 2.5,
            delay: '0.3s',
          },
          // Right ribbon end
          {
            type: 'path',
            className: 'hat-outline',
            d: 'M 60,30 Q 62,30 64,31 Q 66,32 68,34',
            strokeWidth: 2.5,
            delay: '0.35s',
          },
        ],
      },
    ],
  },

];

function HandDrawnEffect({ effect }: { effect: typeof HAND_DRAWN_EFFECTS[0] }) {
  return (
    <>
      {effect.elements.map((element, idx) => (
        <svg
          key={`${effect.id}-${idx}`}
          className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-hat-svg md:translate-y-2 md:-translate-x-0.5"
          style={{
            ...element.style,
            overflow: 'visible'
          }}
          viewBox={element.viewBox}
          xmlns="http://www.w3.org/2000/svg"
        >
          {element.paths.map((path: any, pathIdx: number) => {
            if (path.type === 'group') {
              return (
                <g key={pathIdx} className={path.className}>
                  {path.children?.map((child: any, childIdx: number) => (
                    <line
                      key={childIdx}
                      x1={child.x1}
                      y1={child.y1}
                      x2={child.x2}
                      y2={child.y2}
                      stroke="var(--primary-dark)"
                      strokeWidth={child.strokeWidth}
                    />
                  ))}
                </g>
              );
            } else if (path.type === 'line') {
              return (
                <line
                  key={pathIdx}
                  className={path.className}
                  x1={path.x1}
                  y1={path.y1}
                  x2={path.x2}
                  y2={path.y2}
                  stroke="var(--primary-dark)"
                  strokeWidth={path.strokeWidth}
                  strokeLinecap="round"
                  style={path.delay ? {
                    strokeDasharray: '1000',
                    strokeDashoffset: '1000',
                    animationDelay: path.delay
                  } : undefined}
                />
              );
            } else if (path.type === 'circle') {
              return (
                <circle
                  key={pathIdx}
                  className={path.className}
                  cx={path.cx}
                  cy={path.cy}
                  r={path.r}
                  fill={path.fill || 'none'}
                  stroke={path.fill ? 'none' : 'var(--primary-dark)'}
                  strokeWidth={path.strokeWidth || 0}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={path.delay ? {
                    strokeDasharray: '1000',
                    strokeDashoffset: '1000',
                    animationDelay: path.delay
                  } : undefined}
                />
              );
            } else {
              return (
                <path
                  key={pathIdx}
                  className={path.className}
                  d={path.d}
                  fill={path.fill || 'none'}
                  stroke={path.fill && path.strokeWidth === 0 ? 'none' : 'var(--primary-dark)'}
                  strokeWidth={path.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={path.opacity}
                  style={path.delay ? {
                    strokeDasharray: '1000',
                    strokeDashoffset: '1000',
                    animationDelay: path.delay
                  } : undefined}
                />
              );
            }
          })}
        </svg>
      ))}
    </>
  );
}

// ---------- Main Component ----------
export default function Site() {
  const [mounted, setMounted] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState(HAND_DRAWN_EFFECTS[0]);

  useEffect(() => { setMounted(true); }, []);

  // Pick a random effect on hover
  const handleMouseEnter = () => {
    const randomEffect = HAND_DRAWN_EFFECTS[Math.floor(Math.random() * HAND_DRAWN_EFFECTS.length)];
    setSelectedEffect(randomEffect);
  };

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
              Hi, I&apos;m <HandDrawnText>Nyan Prakash</HandDrawnText>
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
                href={DATA.cta.calendarly}
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
                Schedule A Meeting
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
            <div className="relative md:pt-0" style={{ padding: '80px 40px 40px' }}>
              {/* Photo */}
              <div
                className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-2xl overflow-visible shadow-2x group"
                style={{
                  border: '4px solid var(--primary)',
                  transitionDuration: 'var(--transition-slow)'
                }}
                onMouseEnter={handleMouseEnter}
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

                {/* Render the selected hand-drawn effect */}
                <HandDrawnEffect effect={selectedEffect} />
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
          {DATA.experience.map((exp) => (
            <div
              key={exp.role}
              className="border-l-2 pl-6"
              style={{
                borderColor: 'var(--primary)',
                opacity: 0.96
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
                    className="flex gap-2"
                    style={{
                      fontSize: 'var(--font-size-body)',
                      color: 'var(--gray-600)',
                      lineHeight: 'var(--line-height-relaxed)'
                    }}
                  >
                    <span style={{ color: 'var(--primary)', fontSize: '1.2em' }}>✦</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
              Let&apos;s Work Together
            </h2>
            <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--gray-600)', lineHeight: 'var(--line-height-relaxed)' }}>
              Interested in collaborating or want to chat about robotics, AI, or prototyping? I&apos;m always open to new opportunities.
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
