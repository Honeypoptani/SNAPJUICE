import { Link } from "react-router-dom";

export function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-100 to-amber-50 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-900/80">
            Campus delivery
          </p>
          <h1 className="mt-2 max-w-2xl text-4xl font-extrabold leading-tight text-orange-950 md:text-5xl">
            Fresh juice & fruit — snap it up tomorrow.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-orange-900/90">
            Build your bowl, pick fruits, or grab a juice. Order by{" "}
            <strong>midnight</strong> for next-day delivery at fixed campus slots.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-900/20 transition hover:bg-orange-700"
            >
              Browse menu
            </Link>
            <Link
              to="/checkout"
              className="rounded-full border-2 border-orange-800 bg-white/80 px-6 py-3 font-semibold text-orange-900 hover:bg-white"
            >
              Go to checkout
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-2xl font-bold text-orange-950">How it works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Pick your picks",
              body: "Choose fruit salad bowls (100g–300g), loose fruits, or ready juices.",
            },
            {
              step: "02",
              title: "Order a day ahead",
              body: "Place your order by midnight for delivery the next day. No same-day rush.",
            },
            {
              step: "03",
              title: "Delivered on slot",
              body: "1 PM, 2 PM, or 5 PM+ to CG, sports complex, or girls hostel.",
            },
          ].map((c) => (
            <div
              key={c.step}
              className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-bold text-orange-500">{c.step}</p>
              <h3 className="mt-2 text-lg font-semibold text-orange-950">{c.title}</h3>
              <p className="mt-2 text-sm text-orange-800/90">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-orange-200 bg-white px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-orange-950">Why Snap Juice?</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Affordable vs campus cafes — smart inventory",
              "Zero-waste mindset — order what we need",
              "Weekly or monthly subscriptions",
              "UPI or cash on delivery",
            ].map((t) => (
              <li
                key={t}
                className="flex items-start gap-2 text-orange-900"
              >
                <span className="mt-1 text-orange-500">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
