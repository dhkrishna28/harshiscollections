import PageLayout from "@/components/majori/PageLayout";
import PageHeader from "@/components/majori/PageHeader";
import Newsletter from "@/components/majori/Newsletter";

const contacts = [
  {
    title: "Address",
    body: "123 Fashion Avenue, New York, NY 10001",
    icon: (
      <>
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  {
    title: "Phone",
    body: "+1 (555) 123 4567",
    icon: (
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
    ),
  },
  {
    title: "Email",
    body: "support@harshiscollections.com",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>
    ),
  },
  {
    title: "Hours",
    body: "Mon-Fri: 9am-6pm EST",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
];

const Contact = () => (
  <PageLayout>
    <PageHeader title="Contact" crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]} />

    <section className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div>
          <p className="uppercase tracking-[0.3em] text-xs text-brand mb-3">Get In Touch</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-5">
            We'd love to hear from you.
          </h2>
          <p className="text-mute mb-8 leading-relaxed">
            Have a question about an order, a styling tip request, or wholesale enquiry? Drop us a
            note and we'll get back within 24 hours.
          </p>

          <ul className="space-y-5">
            {contacts.map((c) => (
              <li key={c.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-sand grid place-items-center flex-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    {c.icon}
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-mute text-sm">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-md">
          <h3 className="font-display text-2xl font-semibold mb-6">Send us a message</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First name"
                className="w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink"
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink"
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              className="w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink"
            />
            <textarea
              rows={5}
              placeholder="Your message"
              className="w-full px-4 py-3 border border-ink/15 rounded outline-none focus:border-ink resize-none"
            />
            <button className="w-full bg-ink text-white py-3 uppercase tracking-wider text-sm hover:bg-brand transition rounded">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>

    <section className="bg-white">
      <iframe
        title="Map"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-74.02,40.70,-73.93,40.78&layer=mapnik"
        className="w-full h-80 border-0"
        loading="lazy"
      />
    </section>

    <Newsletter />
  </PageLayout>
);

export default Contact;
