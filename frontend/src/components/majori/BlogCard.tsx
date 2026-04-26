import { Link } from "react-router-dom";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  bg: string;
}

const BlogCard = ({ post }: { post: BlogPost }) => (
  <article className="group">
    <Link
      to={`/blog/${post.slug}`}
      className={`block aspect-[4/5] ${post.bg} rounded overflow-hidden mb-4 relative`}
    >
      <span className="absolute top-3 left-3 bg-white text-xs px-3 py-1 rounded-full">
        {post.category}
      </span>
    </Link>
    <p className="text-xs text-mute uppercase tracking-wider">
      {post.date} · {post.category}
    </p>
    <h3 className="font-display text-xl mt-2 mb-2 group-hover:text-brand transition">
      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
    </h3>
    <p className="text-sm text-mute leading-relaxed">{post.excerpt}</p>
    <Link
      to={`/blog/${post.slug}`}
      className="inline-block mt-3 text-sm border-b border-ink hover:text-brand hover:border-brand"
    >
      Read more
    </Link>
  </article>
);

export default BlogCard;
