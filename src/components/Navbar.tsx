"use client";

import Link from "next/link";

const NAV_LINKS = [
  { label: "ABOUT", href: "/#about" },
  { label: "PROJECTS", href: "/#projects" },
  { label: "EXPERIENCE", href: "/#experience" },
  { label: "CONTACT", href: "/#contact" },
];

export default function Navbar() {
  return (
    <header className="border-b" style={{ borderColor: 'var(--gray-200)', backgroundColor: 'var(--surface)' }}>
      <div className="mx-auto max-w-6xl" style={{ padding: '1.25rem 2rem' }}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-semibold tracking-wide transition-colors"
            style={{
              fontSize: 'var(--font-size-small)',
              letterSpacing: '0.05em',
              transitionDuration: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--foreground)';
            }}
          >
            Nyan Prakash
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center" style={{ gap: 'var(--spacing-xl)' }}>
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="nav-link"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu indicator */}
          <div className="md:hidden text-xs opacity-60">Menu</div>
        </div>
      </div>
    </header>
  );
}
