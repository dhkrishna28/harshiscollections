import PageLayout from "@/components/majori/PageLayout";

/**
 * Blank starter page — uses the shared PageLayout (Header + Footer + drawers).
 * Drop your section markup inside <main> below.
 */
const Blank = () => {
  return (
    <PageLayout>
      <section className="max-w-7xl mx-auto px-4 py-20 min-h-[50vh]">
        <h1 className="font-display text-3xl md:text-5xl">Blank Page</h1>
        <p className="text-mute mt-3 max-w-2xl">
          This is a starter template with the shared header, footer and drawers
          already wired up. Replace this section with your own content.
        </p>
      </section>
    </PageLayout>
  );
};

export default Blank;
