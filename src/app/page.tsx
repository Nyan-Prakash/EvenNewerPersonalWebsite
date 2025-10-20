"use client";

import Image from "next/image";
import Site from "./Site";
import Link from "next/link";
import { useState } from "react";
import Blog from "./Blog";

export default function Home() {
  const [showBlog, setShowBlog] = useState(false);

  return (
    <div>
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="#" className="text-sm font-bold tracking-wide" onClick={() => setShowBlog(false)}>
            Nyan Prakash
          </Link>
          <nav className="hidden gap-6 text-sm sm:flex">
            {[
              ["About", "about"],
              ["Projects", "projects"],
              ["Experience", "experience"],
              ["Blog", "Blog"],
              ["Contact", "contact"],
            ].map(([label, id]) =>
              label === "Blog" ? (
                <button
                  key={id}
                  className="opacity-80 hover:opacity-100"
                  onClick={() => setShowBlog(true)}
                >
                  {label}
                </button>
              ) : (
                <a
                  key={id}
                  href={`#${id}`}
                  className="opacity-80 hover:opacity-100"
                  onClick={() => setShowBlog(false)}
                >
                  {label}
                </a>
              )
            )}
          </nav>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-neutral-800" />
      </header>
      {!showBlog ? <Site /> : <Blog />}
    </div>
  );
}
