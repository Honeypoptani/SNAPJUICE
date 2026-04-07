import { useEffect, useMemo, useState } from "react";
import { CATEGORY_LABELS } from "../lib/constants";
import { fetchJson } from "../lib/api";
import { useCart } from "../context/CartContext";

export function Menu() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("fruit_salad");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchJson("/api/products");
        if (!cancelled) setProducts(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => products.filter((item) => item.category === selectedCategory),
    [products, selectedCategory]
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-orange-900">Menu</h1>
      <p className="mt-2 text-orange-800">
        Fresh bowls, fruits, and juices — add to cart for next-day delivery.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              selectedCategory === key
                ? "border-orange-700 bg-orange-700 text-white"
                : "border-orange-300 bg-white text-orange-700 hover:border-orange-400"
            }`}
            onClick={() => setSelectedCategory(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="mt-8 text-orange-700">Loading menu...</p>}
      {error && (
        <p className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>
      )}

      {!loading && !error && (
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.length === 0 ? (
            <p className="text-orange-900">No items in this category yet.</p>
          ) : (
            filtered.map((item) => (
              <article
                key={item._id}
                className="flex flex-col rounded-xl border border-orange-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold text-orange-900">{item.name}</h2>
                  <span className="rounded bg-orange-100 px-2 py-1 text-xs font-bold text-orange-800">
                    {item.size}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm text-orange-700">
                  {item.description || "Fresh and healthy."}
                </p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-xl font-bold text-orange-900">Rs. {item.price}</p>
                  <button
                    type="button"
                    onClick={() => addItem(item, 1)}
                    className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                  >
                    Add to cart
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </main>
  );
}
