import { Link } from "react-router-dom";
import PageLayout from "@/components/majori/PageLayout";

const BlogPost = () => (
  <PageLayout>
    <section className="bg-sand py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="font-display text-3xl md:text-5xl">Journal</h1>
        <p className="text-mute mt-2 text-sm">
          <Link to="/" className="hover:text-brand">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/blog" className="hover:text-brand">
            Journal
          </Link>
        </p>
      </div>
    </section>

    <article className="max-w-3xl mx-auto px-4 py-14">
      <p className="text-xs text-mute uppercase tracking-wider text-center">
        Apr 12, 2026 · Style · 5 min read
      </p>
      <h1 className="font-display text-3xl md:text-5xl text-center mt-3 mb-8">
        Spring Style Edit 2026
      </h1>
      <div className="aspect-[16/9] bg-rose/40 rounded mb-10" />
      <div className="prose max-w-none text-ink/80 leading-relaxed space-y-5">
        <p className="text-lg">
          Spring arrives with a softness that asks for lighter layers, gentler palettes and pieces
          that move with you. This season's edit is built around the idea that ease is the highest
          form of elegance.
        </p>
        <p>
          From breezy linens to sun-washed neutrals, our spring collection celebrates fabrics that
          breathe and silhouettes that flatter without effort. Think wrap dresses, relaxed trousers
          and the kind of t-shirt you'll reach for every weekend.
        </p>
        <h2 className="font-display text-2xl mt-8 mb-3">The Color Story</h2>
        <p>
          Cream, sand, soft rose and deep olive form a quiet but confident palette. Mix tones within
          the same family for an effortlessly polished look, or anchor everything with a single
          piece in our signature ink.
        </p>
        <blockquote className="border-l-4 border-brand pl-5 italic text-xl text-ink my-8">
          "Style isn't about wearing the loudest piece — it's about choosing the right one."
        </blockquote>
        <h2 className="font-display text-2xl mt-8 mb-3">Three Looks We Love</h2>
        <p>
          Pair the linen wrap dress with leather slides for weekend brunches. Layer the silk blouse
          over wide-leg trousers for the office. And don't underestimate the power of a great
          cardigan thrown over everything.
        </p>
      </div>
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-ink/10">
        <div className="flex gap-2 text-sm">
          <span className="text-mute">Tags:</span>
          <a href="#" className="hover:text-brand">
            spring
          </a>
          <a href="#" className="hover:text-brand">
            style
          </a>
        </div>
        <div className="flex gap-3 text-mute">
          <a href="#" className="hover:text-brand">
            Share
          </a>
          <a href="#" className="hover:text-brand">
            Tweet
          </a>
          <a href="#" className="hover:text-brand">
            Pin
          </a>
        </div>
      </div>
      <div className="mt-12 bg-sand p-8 rounded flex gap-5 items-center">
        <div className="w-16 h-16 rounded-full bg-brand/30 shrink-0" />
        <div>
          <p className="font-semibold">Olivia Carter</p>
          <p className="text-sm text-mute mt-1">
            Style editor at Harshis Collections. Believer in good linen, strong coffee and slow Sundays.
          </p>
        </div>
      </div>
      <section className="mt-14">
        <h3 className="font-display text-2xl mb-6">Comments (3)</h3>
        <div className="space-y-6">
          {[
            { name: "Sara M.", date: "Apr 13, 2026", text: "Loved the color palette suggestions — already eyeing the wrap dress!" },
            { name: "Daniel R.", date: "Apr 13, 2026", text: "The blockquote hit hard. So true." },
          ].map((c) => (
            <div key={c.name} className="border-b border-ink/10 pb-5">
              <p className="font-semibold">{c.name}</p>
              <p className="text-xs text-mute mb-2">{c.date}</p>
              <p className="text-sm">{c.text}</p>
            </div>
          ))}
        </div>
        <form className="mt-8 grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input className="border border-ink/15 px-4 py-3 rounded" placeholder="Name" />
            <input className="border border-ink/15 px-4 py-3 rounded" placeholder="Email" />
          </div>
          <textarea
            rows={4}
            className="border border-ink/15 px-4 py-3 rounded"
            placeholder="Your comment..."
          />
          <button className="bg-ink text-white px-7 py-3 uppercase text-xs tracking-wider hover:bg-brand transition rounded w-fit">
            Post Comment
          </button>
        </form>
      </section>
    </article>
  </PageLayout>
);

export default BlogPost;
