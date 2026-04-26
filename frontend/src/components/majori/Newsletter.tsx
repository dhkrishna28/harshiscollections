const Newsletter = () => (
  <section className="bg-sand py-14">
    <div className="max-w-3xl mx-auto px-4 text-center">
      <h3 className="font-display text-3xl mb-3">Join the Harshis Collections Letter</h3>
      <p className="text-mute mb-6">Be the first to discover new collections, member-only sales and styling tips.</p>
      <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-5 py-3 bg-white border border-ink/10 focus:border-ink outline-none rounded-md"
        />
        <button className="bg-ink text-white px-7 py-3 uppercase tracking-wider text-sm hover:bg-brand transition rounded-md">
          Subscribe
        </button>
      </form>
    </div>
  </section>
);

export default Newsletter;
