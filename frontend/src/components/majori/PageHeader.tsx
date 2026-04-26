import { Link } from "react-router-dom";

interface Crumb {
  label: string;
  to?: string;
}

interface Props {
  title: string;
  crumbs: Crumb[];
}

const PageHeader = ({ title, crumbs }: Props) => (
  <section className="bg-sand py-10">
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="font-display text-3xl md:text-4xl font-semibold">{title}</h1>
      <nav className="text-sm text-mute mt-2">
        {crumbs.map((c, i) => (
          <span key={i}>
            {c.to ? (
              <Link to={c.to} className="hover:text-brand">
                {c.label}
              </Link>
            ) : (
              <span className="text-ink">{c.label}</span>
            )}
            {i < crumbs.length - 1 && <span className="text-mute mx-2">/</span>}
          </span>
        ))}
      </nav>
    </div>
  </section>
);

export default PageHeader;
