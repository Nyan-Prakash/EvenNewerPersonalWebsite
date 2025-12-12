import type { Metadata } from "next";
import Blog from "../Blog";
import { getPostSummaries } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Nyan Prakash",
  description:
    "Build logs, experiments, and essays on AI, robotics, and shipping product.",
};

export default function BlogIndexPage() {
  const posts = getPostSummaries();
  return <Blog posts={posts} />;
}
