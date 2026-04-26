import PageLayout from "@/components/majori/PageLayout";
import PageHeader from "@/components/majori/PageHeader";
import Newsletter from "@/components/majori/Newsletter";

const About = () => (
  <PageLayout>
    <PageHeader title="About Us" crumbs={[{ label: "Home", to: "/" }, { label: "About Us" }]} />

    <section className="py-14 md:py-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="uppercase tracking-[0.3em] text-xs text-brand mb-3">Our Story</p>
        <h2 className="font-display text-3xl md:text-5xl font-semibold mb-6">
          Designed for the everyday icon.
        </h2>
        <p className="text-mute max-w-2xl mx-auto leading-relaxed">
          Harshis Collections was born from a love of fabric, craftsmanship, and the timeless silhouettes that
          move with you. Every piece is created with intention — to last, to layer, and to live in.
        </p>
      </div>
    </section>

    <section className="bg-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&auto=format&fit=crop&q=80"
          alt="Harshis Collections studio"
          className="rounded-lg w-full aspect-[4/5] object-cover"
        />
        <div>
          <p className="uppercase tracking-[0.3em] text-xs text-brand mb-3">Who We Are</p>
          <h3 className="font-display text-3xl md:text-4xl font-semibold mb-5">
            Crafted in small batches, worn for years.
          </h3>
          <p className="text-mute leading-relaxed mb-4">
            From our New York studio, our team sketches, drapes and refines every silhouette by
            hand before production. We choose mills who share our values — natural fibres,
            transparent supply chains, and fair labour.
          </p>
          <p className="text-mute leading-relaxed">
            The result is clothing you can rely on, season after season.
          </p>
        </div>
      </div>
    </section>

    <section className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Quality First",
            desc: "Premium fabrics tested for longevity and softness in every wash.",
            icon: <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />,
          },
          {
            title: "Ethically Sourced",
            desc: "Transparent supply chains and fair partnerships with our mills.",
            icon: (
              <>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
              </>
            ),
          },
          {
            title: "Made With Love",
            desc: "Hand-finished details by skilled artisans in small batch runs.",
            icon: (
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
            ),
          },
        ].map((v) => (
          <div key={v.title} className="bg-white p-8 rounded-md text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-sand grid place-items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {v.icon}
              </svg>
            </div>
            <h4 className="font-display text-xl mb-2 font-semibold">{v.title}</h4>
            <p className="text-mute text-sm">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-ink text-white py-16">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          ["12+", "Years Crafting"],
          ["240k", "Happy Customers"],
          ["35", "Countries Shipped"],
          ["98%", "5-Star Reviews"],
        ].map(([n, l]) => (
          <div key={l}>
            <p className="font-display text-4xl text-brand">{n}</p>
            <p className="text-sm mt-2 text-white/70">{l}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.3em] text-xs text-brand mb-2">Our Team</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            The makers behind the maison
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Ava Klein", role: "Founder & Creative Director", img: 10 },
            { name: "Marcus Lee", role: "Head of Design", img: 11 },
            { name: "Sara Wu", role: "Production Lead", img: 12 },
            { name: "Idris Khan", role: "Sustainability", img: 13 },
          ].map((m) => (
            <div key={m.name} className="text-center">
              <img
                src={`https://i.pravatar.cc/400?img=${m.img}`}
                alt={m.name}
                className="rounded-md aspect-square object-cover w-full mb-3"
              />
              <p className="font-semibold">{m.name}</p>
              <p className="text-sm text-mute">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Newsletter />
  </PageLayout>
);

export default About;
