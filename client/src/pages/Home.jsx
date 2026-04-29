import { Link } from "react-router-dom";

const trustBadges = [
  { icon: "🍊", title: "Only Fresh Fruits", desc: "Every item is sourced fresh daily — no frozen, no packaged." },
  { icon: "✅", title: "No Mixtures. 100% Pure", desc: "Pure fruit, pure juice — zero artificial flavours or syrups." },
  { icon: "🚫", title: "Zero Additives", desc: "No sugar added, no preservatives, just nature." },
  { icon: "💚", title: "Handpicked Daily", desc: "Fruits are handpicked every morning before your order arrives." },
];

const howItWorks = [
  {
    step: "01",
    title: "Pick your picks",
    body: "Choose from fruits (150g), build your own salad bowl, or grab a fresh juice.",
  },
  {
    step: "02",
    title: "Order a day ahead",
    body: "Place your order by midnight for delivery the next day. No same-day rush.",
  },
  {
    step: "03",
    title: "Delivered on slot",
    body: "1 PM, 2 PM, or 5 PM+ to CG, Sports Complex, or Girls Hostel.",
  },
];

const whyUs = [
  "Affordable vs campus cafes — smart inventory",
  "Zero-waste mindset — order what we need",
  "No mixing, no shortcuts — pure and honest",
  "COD available — pay when you receive",
];

export function Home() {
  return (
    <div className="font-sans">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-100 to-amber-50 px-4 py-20 md:py-28">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-48 w-48 rounded-full bg-amber-300/20 blur-2xl" />

        <div className="relative mx-auto max-w-5xl">
          <span className="inline-block rounded-full bg-orange-600/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-orange-700">
            🏫 Campus Delivery
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight text-orange-950 md:text-5xl lg:text-6xl">
            Fresh juice & fruit —{" "}
            <span className="text-orange-600">snap it up</span> tomorrow.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-orange-900/80">
            Build your salad bowl, pick fresh fruits, or grab a cold-pressed juice.
            Order by <strong>midnight</strong> for next-day delivery at fixed campus slots.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="rounded-full bg-orange-600 px-7 py-3 font-bold text-white shadow-lg shadow-orange-900/20 transition hover:bg-orange-700 hover:scale-105 active:scale-95"
            >
              Browse Menu →
            </Link>
            <Link
              to="/cart"
              className="rounded-full border-2 border-orange-800 bg-white/80 px-7 py-3 font-bold text-orange-900 transition hover:bg-white"
            >
              View Cart
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Simple Process</p>
        <h2 className="mt-1 text-2xl font-bold text-orange-950 md:text-3xl">How it works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {howItWorks.map((c) => (
            <div
              key={c.step}
              className="group rounded-2xl border border-orange-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1"
            >
              <p className="text-3xl font-black text-orange-200 group-hover:text-orange-300 transition">{c.step}</p>
              <h3 className="mt-3 text-lg font-semibold text-orange-950">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-orange-800/80">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY SNAP JUICE ── */}
      <section className="border-y border-orange-200 bg-orange-50/60 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Our Promise</p>
          <h2 className="mt-1 text-2xl font-bold text-orange-950 md:text-3xl">Why Snap Juice?</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {whyUs.map((t) => (
              <li key={t} className="flex items-start gap-3 rounded-xl border border-orange-100 bg-white p-4 shadow-sm text-orange-900">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-sm font-bold">✓</span>
                <span className="text-sm leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── ONLY FRESH / 100% PURE (NEW SECTION) ── */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-100 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Our Standards</p>
          <h2 className="mt-1 text-2xl font-bold text-orange-950 md:text-3xl">
            Only fresh fruits. No mixtures.{" "}
            <span className="text-orange-600">100% pure.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-orange-800/80">
            We don't cut corners. Every fruit you order is fresh, every juice is made to order,
            and every salad bowl is built by you — exactly how you want it.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustBadges.map((b) => (
              <div
                key={b.title}
                className="flex flex-col items-start gap-3 rounded-2xl border border-orange-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-1"
              >
                <span className="text-3xl">{b.icon}</span>
                <h3 className="font-bold text-orange-950">{b.title}</h3>
                <p className="text-xs leading-relaxed text-orange-700/80">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-orange-600 px-4 py-14 text-center">
        <h2 className="text-2xl font-extrabold text-white md:text-3xl">
          Ready for something fresh?
        </h2>
        <p className="mt-2 text-orange-100">Order by midnight. Delivered tomorrow.</p>
        <Link
          to="/menu"
          className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-bold text-orange-700 shadow-lg transition hover:bg-orange-50 hover:scale-105"
        >
          Order Now →
        </Link>
      </section>
    </div>
  );
}