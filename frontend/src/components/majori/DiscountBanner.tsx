const DiscountBanner = () => (
  <section className="bg-white py-10">
    <div className="max-w-7xl mx-auto px-6 bg-cream rounded-lg py-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-8 text-center md:text-left">
        <p className="text-ink text-[15px] md:text-[17px]">
          Super discount for <span className="text-accent-red font-semibold">first purchase.</span>
        </p>
        <div className="border border-dashed border-accent-red px-5 py-2.5">
          <span className="text-accent-red font-medium tracking-[0.15em] text-[13px] md:text-[14px]">FREE15FIRST</span>
        </div>
        <p className="text-ink text-[15px] md:text-[17px]">Use discount code in checkout!</p>
      </div>
    </div>
  </section>
);

export default DiscountBanner;
