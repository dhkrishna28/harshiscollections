import PageLayout from "@/components/majori/PageLayout";
import PageHeader from "@/components/majori/PageHeader";

const sections = [
  {
    id: "terms",
    h: "Terms of Service",
    big: true,
    body: "Welcome to Harshis Collections. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully before placing an order or creating an account.",
  },
  { id: "use", h: "1. Use of Site", body: "You agree to use the site only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the service. You may not attempt to gain unauthorized access to any part of the site, accounts, or systems." },
  { id: "orders", h: "2. Orders & Payment", body: "All orders are subject to availability and acceptance. We reserve the right to refuse or cancel an order at any time. Prices are listed in USD and may change without notice. Payment is processed securely at checkout via our payment partners." },
  { id: "shipping", h: "3. Shipping & Returns", body: "We ship worldwide. Domestic orders typically arrive within 3–5 business days; international orders within 7–14 business days. Items may be returned within 30 days of delivery, in original condition, for a full refund." },
  { id: "privacy", h: "Privacy Policy", big: true, divide: true, body: "Your privacy is important to us. This policy describes what information we collect, how we use it, and the choices you have." },
  { id: "data", h: "1. Data We Collect", body: "We collect information you provide directly (such as name, email, shipping address, and payment details) and information collected automatically (such as device, browser, and browsing behaviour) when you use our site." },
  { id: "cookies", h: "2. Cookies", body: "We use cookies and similar technologies to remember your preferences, keep you signed in, analyse traffic, and personalise content. You can control cookies through your browser settings." },
];

const TOC = [
  { href: "#terms", label: "Terms of Service" },
  { href: "#use", label: "Use of Site", indent: true },
  { href: "#orders", label: "Orders & Payment", indent: true },
  { href: "#shipping", label: "Shipping & Returns", indent: true },
  { href: "#privacy", label: "Privacy Policy", gap: true },
  { href: "#data", label: "Data We Collect", indent: true },
  { href: "#cookies", label: "Cookies", indent: true },
  { href: "#rights", label: "Your Rights", indent: true },
  { href: "#contact", label: "Contact", gap: true },
];

const Terms = () => (
  <PageLayout>
    <PageHeader
      title="Terms & Privacy"
      crumbs={[{ label: "Home", to: "/" }, { label: "Terms & Privacy" }]}
    />

    <section className="max-w-6xl mx-auto px-4 py-14">
      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="lg:w-60 shrink-0">
          <div className="lg:sticky lg:top-24 bg-white border border-ink/10 rounded p-5">
            <p className="text-xs uppercase tracking-wider text-mute mb-3">On this page</p>
            <nav className="flex flex-col gap-2 text-sm">
              {TOC.map((t) => (
                <a
                  key={t.href}
                  href={t.href}
                  className={`hover:text-brand ${t.indent ? "pl-3 text-mute" : ""} ${t.gap ? "mt-3" : ""}`}
                >
                  {t.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
        <article className="flex-1 bg-white border border-ink/10 rounded p-8 md:p-12 space-y-8 leading-relaxed text-ink/85">
          <p className="text-xs uppercase tracking-wider text-mute">Last updated: April 1, 2026</p>
          {sections.map((s) => (
            <section key={s.id} id={s.id} className={s.divide ? "pt-4 border-t border-ink/10" : ""}>
              {s.big ? (
                <h2 className="font-display text-3xl mb-4">{s.h}</h2>
              ) : (
                <h3 className="font-display text-xl mb-3">{s.h}</h3>
              )}
              <p>{s.body}</p>
            </section>
          ))}
          <section id="rights">
            <h3 className="font-display text-xl mb-3">3. Your Rights</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
          </section>
          <section id="contact" className="pt-4 border-t border-ink/10">
            <h3 className="font-display text-xl mb-3">Contact</h3>
            <p>
              For any questions about these terms or our privacy practices, email{" "}
              <a href="mailto:privacy@harshiscollections.com" className="text-brand hover:underline">
                privacy@harshiscollections.com
              </a>{" "}
              or write to 123 Fashion Avenue, New York, NY 10001.
            </p>
          </section>
        </article>
      </div>
    </section>
  </PageLayout>
);

export default Terms;
