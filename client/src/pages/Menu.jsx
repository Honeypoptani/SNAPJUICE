import { useEffect, useMemo, useState } from "react";
import { CATEGORY_LABELS } from "../lib/constants";
import { fetchJson } from "../lib/api";
import { useCart } from "../context/CartContext";

// ─── Static fruit data with benefits, prices, availability ───────────────────
const FRUITS = [
  {
    id: "mango",
    name: "Mango",
    emoji: "🥭",
    pricePerUnit: 25, // per 150g
    available: true,
    benefits: ["Rich in Vitamin C & A", "Boosts immunity", "Good for skin & hair", "Natural energy source"],
  },
  {
    id: "watermelon",
    name: "Watermelon",
    emoji: "🍉",
    pricePerUnit: 15,
    available: true,
    benefits: ["92% water — great hydration", "Rich in lycopene", "Reduces muscle soreness", "Low in calories"],
  },
  {
    id: "pineapple",
    name: "Pineapple",
    emoji: "🍍",
    pricePerUnit: 20,
    available: true,
    benefits: ["Contains bromelain enzyme", "Aids digestion", "Anti-inflammatory", "Vitamin C powerhouse"],
  },
  {
    id: "papaya",
    name: "Papaya",
    emoji: "🍈",
    pricePerUnit: 18,
    available: true,
    benefits: ["Excellent for digestion", "Rich in folate", "Boosts heart health", "Anti-oxidant rich"],
  },
  {
    id: "banana",
    name: "Banana",
    emoji: "🍌",
    pricePerUnit: 10,
    available: true,
    benefits: ["Instant energy boost", "High in potassium", "Supports gut health", "Good for mood (serotonin)"],
  },
  {
    id: "guava",
    name: "Guava",
    emoji: "🍏",
    pricePerUnit: 15,
    available: true,
    benefits: ["4x more Vitamin C than orange", "High dietary fibre", "Regulates blood sugar", "Boosts immunity"],
  },
  {
    id: "pomegranate",
    name: "Pomegranate",
    emoji: "🍇",
    pricePerUnit: 35,
    available: true,
    benefits: ["Powerful antioxidants", "Reduces blood pressure", "Anti-inflammatory properties", "Good for memory"],
  },
  {
    id: "apple",
    name: "Apple",
    emoji: "🍎",
    pricePerUnit: 22,
    available: true,
    benefits: ["Rich in fibre (pectin)", "Supports gut bacteria", "Lowers cholesterol", "Good for heart health"],
  },
  {
    id: "kiwi",
    name: "Kiwi",
    emoji: "🥝",
    pricePerUnit: 30,
    available: false,
    benefits: ["More Vitamin C than orange", "Improves sleep quality", "Supports immune system", "Rich in Vitamin K"],
  },
  {
    id: "strawberry",
    name: "Strawberry",
    emoji: "🍓",
    pricePerUnit: 45,
    available: false,
    benefits: ["Loaded with antioxidants", "Regulates blood sugar", "Great for skin", "Anti-cancer properties"],
  },
  {
    id: "grapes",
    name: "Grapes",
    emoji: "🍇",
    pricePerUnit: 28,
    available: true,
    benefits: ["High in resveratrol", "Supports heart health", "Anti-ageing properties", "Hydrating & refreshing"],
  },
  {
    id: "orange",
    name: "Orange",
    emoji: "🍊",
    pricePerUnit: 18,
    available: true,
    benefits: ["Vitamin C immune boost", "Reduces inflammation", "Good for skin collagen", "Supports iron absorption"],
  },
];

const JUICES = [
  {
    id: "j_mango",
    name: "Mango Juice",
    emoji: "🥭",
    sizes: [{ label: "250ml", price: 40 }, { label: "500ml", price: 70 }],
    available: true,
    benefits: ["Freshly squeezed, no sugar added", "Rich in Vitamin A & C", "Natural energy booster", "Gut-friendly & refreshing"],
  },
  {
    id: "j_watermelon",
    name: "Watermelon Juice",
    emoji: "🍉",
    sizes: [{ label: "250ml", price: 30 }, { label: "500ml", price: 55 }],
    available: true,
    benefits: ["Super hydrating", "Contains lycopene antioxidant", "Zero added sugar", "Cooling & refreshing"],
  },
  {
    id: "j_orange",
    name: "Orange Juice",
    emoji: "🍊",
    sizes: [{ label: "250ml", price: 35 }, { label: "500ml", price: 60 }],
    available: true,
    benefits: ["Pure squeezed oranges", "Vitamin C immunity boost", "Aids iron absorption", "Natural detox drink"],
  },
  {
    id: "j_pineapple",
    name: "Pineapple Juice",
    emoji: "🍍",
    sizes: [{ label: "250ml", price: 38 }, { label: "500ml", price: 65 }],
    available: true,
    benefits: ["Contains bromelain enzyme", "Aids digestion naturally", "Anti-inflammatory", "Sweet & tangy, no syrup"],
  },
  {
    id: "j_guava",
    name: "Guava Juice",
    emoji: "🍏",
    sizes: [{ label: "250ml", price: 32 }, { label: "500ml", price: 58 }],
    available: true,
    benefits: ["High Vitamin C content", "Good for gut health", "Regulates blood sugar", "Unique refreshing flavour"],
  },
  {
    id: "j_mixed_fruit",
    name: "Mixed Fruit Juice",
    emoji: "🍹",
    sizes: [{ label: "250ml", price: 45 }, { label: "500ml", price: 80 }],
    available: true,
    benefits: ["Seasonal fruit blend", "Multi-vitamin punch", "Naturally sweet", "Zero artificial flavours"],
  },
];

const SALAD_FRUITS = FRUITS.filter((f) => f.available);
const WEIGHT_OPTIONS = [30, 50, 100, 150];

// ─── Fruit Card ───────────────────────────────────────────────────────────────
function FruitCard({ fruit, onAdd }) {
  const [showBenefits, setShowBenefits] = useState(false);
  const [selectedSize] = useState("150g");

  return (
    <article className="flex flex-col rounded-2xl border border-orange-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md">
      <div className="flex items-center gap-3 p-4 pb-2">
        <span className="text-4xl">{fruit.emoji}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-orange-950">{fruit.name}</h3>
            {!fruit.available && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                Out of season
              </span>
            )}
          </div>
          <p className="text-xs text-orange-600 font-medium mt-0.5">150g pack</p>
        </div>
      </div>

      {/* Benefits toggle */}
      <button
        type="button"
        onClick={() => setShowBenefits((v) => !v)}
        className="mx-4 mb-2 rounded-lg bg-orange-50 px-3 py-1.5 text-left text-xs font-semibold text-orange-700 hover:bg-orange-100 transition flex items-center justify-between"
      >
        <span>🌿 Benefits</span>
        <span>{showBenefits ? "▲" : "▼"}</span>
      </button>

      {showBenefits && (
        <ul className="mx-4 mb-3 rounded-xl bg-green-50 border border-green-100 p-3 space-y-1">
          {fruit.benefits.map((b) => (
            <li key={b} className="flex items-start gap-1.5 text-xs text-green-800">
              <span className="mt-0.5 text-green-500">✓</span> {b}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-orange-100 px-4 py-3">
        <p className="text-lg font-extrabold text-orange-900">₹{fruit.pricePerUnit}</p>
        <button
          type="button"
          disabled={!fruit.available}
          onClick={() => onAdd(fruit)}
          className="rounded-full bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
        >
          {fruit.available ? "Add to cart" : "Unavailable"}
        </button>
      </div>
    </article>
  );
}

// ─── Juice Card ───────────────────────────────────────────────────────────────
function JuiceCard({ juice, onAdd }) {
  const [showBenefits, setShowBenefits] = useState(false);
  const [selectedSize, setSelectedSize] = useState(juice.sizes[0]);

  return (
    <article className="flex flex-col rounded-2xl border border-orange-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md">
      <div className="flex items-center gap-3 p-4 pb-2">
        <span className="text-4xl">{juice.emoji}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-orange-950">{juice.name}</h3>
            {!juice.available && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                Unavailable
              </span>
            )}
          </div>
          <p className="text-xs text-orange-600 font-medium mt-0.5">Cold-pressed • No sugar</p>
        </div>
      </div>

      {/* Size selector */}
      <div className="mx-4 mb-2 flex gap-2">
        {juice.sizes.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setSelectedSize(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition border ${
              selectedSize.label === s.label
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-orange-700 border-orange-200 hover:border-orange-400"
            }`}
          >
            {s.label} — ₹{s.price}
          </button>
        ))}
      </div>

      {/* Benefits toggle */}
      <button
        type="button"
        onClick={() => setShowBenefits((v) => !v)}
        className="mx-4 mb-2 rounded-lg bg-orange-50 px-3 py-1.5 text-left text-xs font-semibold text-orange-700 hover:bg-orange-100 transition flex items-center justify-between"
      >
        <span>🌿 Benefits</span>
        <span>{showBenefits ? "▲" : "▼"}</span>
      </button>

      {showBenefits && (
        <ul className="mx-4 mb-3 rounded-xl bg-green-50 border border-green-100 p-3 space-y-1">
          {juice.benefits.map((b) => (
            <li key={b} className="flex items-start gap-1.5 text-xs text-green-800">
              <span className="mt-0.5 text-green-500">✓</span> {b}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-orange-100 px-4 py-3">
        <p className="text-lg font-extrabold text-orange-900">₹{selectedSize.price}</p>
        <button
          type="button"
          disabled={!juice.available}
          onClick={() => onAdd(juice, selectedSize)}
          className="rounded-full bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
        >
          {juice.available ? "Add to cart" : "Unavailable"}
        </button>
      </div>
    </article>
  );
}

// ─── Fruit Salad Builder ──────────────────────────────────────────────────────
function SaladBuilder({ onAdd }) {
  const [selections, setSelections] = useState({}); // { fruitId: grams }
  const PRICE_PER_100G = 20; // Rs 20 per 100g

  const totalGrams = Object.values(selections).reduce((a, b) => a + b, 0);
  const totalPrice = Math.ceil((totalGrams / 100) * PRICE_PER_100G);

  const updateFruit = (fruitId, grams) => {
    setSelections((prev) => {
      if (grams === 0) {
        const next = { ...prev };
        delete next[fruitId];
        return next;
      }
      return { ...prev, [fruitId]: grams };
    });
  };

  const handleAddBowl = () => {
    if (totalGrams === 0) return;
    const items = SALAD_FRUITS.filter((f) => selections[f.id]).map((f) => ({
      name: `${f.emoji} ${f.name}`,
      grams: selections[f.id],
    }));
    const desc = items.map((i) => `${i.name} ${i.grams}g`).join(", ");
    onAdd({
      _id: `salad_${Date.now()}`,
      name: `🥗 Custom Salad Bowl (${totalGrams}g)`,
      description: desc,
      price: totalPrice,
      category: "fruit_salad",
      size: `${totalGrams}g`,
    });
    setSelections({});
  };

  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
        <div>
          <h2 className="text-xl font-bold text-orange-950">Build Your Salad Bowl 🥗</h2>
          <p className="mt-1 text-sm text-orange-700">
            Pick fruits and choose their weight. Min 30g per fruit. Price: ₹{PRICE_PER_100G}/100g.
          </p>
        </div>
        {totalGrams > 0 && (
          <div className="text-right">
            <p className="text-xs text-orange-600 font-semibold">{totalGrams}g total</p>
            <p className="text-xl font-black text-orange-900">₹{totalPrice}</p>
          </div>
        )}
      </div>

      {/* Preset sizes badge */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700 font-semibold">Standard: 150g</span>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700 font-semibold">Large: 300g</span>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500">Mix however you like!</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SALAD_FRUITS.map((fruit) => {
          const selected = selections[fruit.id] || 0;
          return (
            <div
              key={fruit.id}
              className={`rounded-xl border p-3 transition ${
                selected > 0
                  ? "border-orange-400 bg-orange-50"
                  : "border-orange-100 bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{fruit.emoji}</span>
                <span className="text-sm font-semibold text-orange-950">{fruit.name}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {[0, ...WEIGHT_OPTIONS].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateFruit(fruit.id, g)}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold transition border ${
                      selected === g
                        ? "bg-orange-600 text-white border-orange-600"
                        : "bg-white text-orange-600 border-orange-200 hover:border-orange-400"
                    }`}
                  >
                    {g === 0 ? "✕" : `${g}g`}
                  </button>
                ))}
              </div>
              {selected > 0 && (
                <p className="mt-1 text-xs text-orange-600 font-medium">
                  ₹{Math.ceil((selected / 100) * PRICE_PER_100G)} for {selected}g
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAddBowl}
        disabled={totalGrams === 0}
        className="mt-6 w-full rounded-full bg-orange-600 py-3 font-bold text-white hover:bg-orange-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition text-sm"
      >
        {totalGrams === 0
          ? "Select fruits to build your bowl"
          : `Add bowl (${totalGrams}g) — ₹${totalPrice} to cart`}
      </button>
    </div>
  );
}

// ─── Main Menu Component ──────────────────────────────────────────────────────
export function Menu() {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("fruits");

  const handleAddFruit = (fruit) => {
    addItem(
      {
        _id: fruit.id,
        name: `${fruit.emoji} ${fruit.name}`,
        price: fruit.pricePerUnit,
        category: "fruits",
        size: "150g",
      },
      1
    );
  };

  const handleAddJuice = (juice, size) => {
    addItem(
      {
        _id: `${juice.id}_${size.label}`,
        name: `${juice.emoji} ${juice.name} (${size.label})`,
        price: size.price,
        category: "juices",
        size: size.label,
      },
      1
    );
  };

  const handleAddSalad = (saladItem) => {
    addItem(saladItem, 1);
  };

  const categories = [
    { key: "fruits", label: "🍊 Fruits", desc: "Fresh seasonal fruits — 150g packs" },
    { key: "juices", label: "🥤 Juices", desc: "Cold-pressed, pure — no sugar added" },
    { key: "fruit_salad", label: "🥗 Build a Salad", desc: "Pick fruits by weight, make your own bowl" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-orange-900">Menu</h1>
      <p className="mt-1 text-orange-700">
        100% pure. No additives. No mixtures. Just fresh.
      </p>

      {/* Category Tabs */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setSelectedCategory(cat.key)}
            className={`rounded-2xl border p-4 text-left transition ${
              selectedCategory === cat.key
                ? "border-orange-600 bg-orange-600 text-white shadow-md"
                : "border-orange-200 bg-white text-orange-900 hover:border-orange-400"
            }`}
          >
            <p className="font-bold text-base">{cat.label}</p>
            <p className={`mt-0.5 text-xs ${selectedCategory === cat.key ? "text-orange-100" : "text-orange-600"}`}>
              {cat.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-8">
        {selectedCategory === "fruits" && (
          <>
            <p className="mb-4 text-sm text-orange-700">
              All fruits come in <strong>150g packs</strong>. Greyed out = out of season right now.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FRUITS.map((fruit) => (
                <FruitCard key={fruit.id} fruit={fruit} onAdd={handleAddFruit} />
              ))}
            </div>
          </>
        )}

        {selectedCategory === "juices" && (
          <>
            <p className="mb-4 text-sm text-orange-700">
              All juices are <strong>cold-pressed to order</strong>. No sugar, no syrups. Choose your size.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {JUICES.map((juice) => (
                <JuiceCard key={juice.id} juice={juice} onAdd={handleAddJuice} />
              ))}
            </div>
          </>
        )}

        {selectedCategory === "fruit_salad" && (
          <SaladBuilder onAdd={handleAddSalad} />
        )}
      </div>
    </main>
  );
}