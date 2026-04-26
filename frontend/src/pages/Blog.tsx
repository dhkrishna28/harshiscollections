import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/majori/PageLayout";
import BlogCard, { BlogPost } from "@/components/majori/BlogCard";

const POSTS: BlogPost[] = [
  { slug: "spring-style-edit-2026", title: "Spring Style Edit 2026", date: "Apr 12, 2026", category: "Style", excerpt: "A short and inviting excerpt that pulls the reader into the full story of the post.", bg: "bg-rose/40" },
  { slug: "build-a-capsule-wardrobe", title: "How to Build a Capsule Wardrobe", date: "Apr 05, 2026", category: "Guides", excerpt: "A short and inviting excerpt that pulls the reader into the full story of the post.", bg: "bg-sand/40" },
  { slug: "sustainable-fabrics", title: "Sustainable Fabrics We Love", date: "Mar 28, 2026", category: "Sustainability", excerpt: "A short and inviting excerpt that pulls the reader into the full story of the post.", bg: "bg-brand/40" },
  { slug: "behind-the-seams-linen", title: "Behind the Seams: Linen Edit", date: "Mar 19, 2026", category: "Stories", excerpt: "A short and inviting excerpt that pulls the reader into the full story of the post.", bg: "bg-rose/40" },
  { slug: "accessorizing-minimalist", title: "Accessorizing the Minimalist Way", date: "Mar 10, 2026", category: "Style", excerpt: "A short and inviting excerpt that pulls the reader into the full story of the post.", bg: "bg-sand/40" },
  { slug: "travel-ready-summer", title: "Travel-Ready Looks for Summer", date: "Feb 28, 2026", category: "Travel", excerpt: "A short and inviting excerpt that pulls the reader into the full story of the post.", bg: "bg-brand/40" },
];

const TAGS = ["All", "Style", "Guides", "Sustainability", "Travel"];

const Blog = () => {
  const [active, setActive] = useState("All");
  const visible = active === "All" ? POSTS : POSTS.filter((p) => p.category === active);

  return (
    <PageLayout>
      <section className="bg-sand py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-5xl">Journal</h1>
          <p className="text-mute mt-2 text-sm">
            <Link to="/" className="hover:text-brand">
              Home
            </Link>{" "}
            / <span className="text-ink">Journal</span>
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2 text-sm">
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`px-4 py-2 rounded-full transition ${
                  active === t
                    ? "bg-ink text-white"
                    : "border border-ink/20 hover:bg-ink hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <select className="border border-ink/20 px-4 py-2 rounded text-sm bg-white">
            <option>Sort: Latest</option>
            <option>Sort: Popular</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {visible.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-14">
          <button className="w-10 h-10 grid place-items-center border border-ink/20 rounded hover:bg-ink hover:text-white">
            ‹
          </button>
          <button className="w-10 h-10 grid place-items-center bg-ink text-white rounded">1</button>
          <button className="w-10 h-10 grid place-items-center border border-ink/20 rounded hover:bg-ink hover:text-white">
            2
          </button>
          <button className="w-10 h-10 grid place-items-center border border-ink/20 rounded hover:bg-ink hover:text-white">
            3
          </button>
          <button className="w-10 h-10 grid place-items-center border border-ink/20 rounded hover:bg-ink hover:text-white">
            ›
          </button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Blog;
