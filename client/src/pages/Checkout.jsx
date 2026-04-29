import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { fetchJson } from "../lib/api";
import {
  DELIVERY_AREAS,
  DELIVERY_FEE,
  DELIVERY_SLOTS,
  minDeliveryDateStr,
} from "../lib/constants";

// Step indicators
const STEPS = [
  { id: 1, label: "Verify Mobile" },
  { id: 2, label: "Pick Slot" },
  { id: 3, label: "Select Area" },
  { id: 4, label: "Confirm" },
];

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${
                current > step.id
                  ? "bg-green-500 text-white"
                  : current === step.id
                  ? "bg-orange-600 text-white"
                  : "bg-orange-100 text-orange-400"
              }`}
            >
              {current > step.id ? "✓" : step.id}
            </div>
            <p
              className={`mt-1 text-center text-[10px] font-semibold hidden sm:block ${
                current >= step.id ? "text-orange-800" : "text-orange-300"
              }`}
            >
              {step.label}
            </p>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-0.5 flex-1 mx-1 rounded transition ${
                current > step.id + 1 ? "bg-green-400" : "bg-orange-100"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function Checkout() {
  const { items, total, clear } = useCart();
  const { isLoggedIn, user, login, logout, authFetch } = useAuth();

  // Step state: 1=verify phone, 2=pick slot, 3=pick area, 4=confirm
  const [step, setStep] = useState(isLoggedIn ? 2 : 1);

  // Auth
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [devOtpHint, setDevOtpHint] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");

  // Delivery
  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDateStr());
  const [deliverySlot, setDeliverySlot] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");

  // Payment — COD only for now
  const paymentMethod = "cod";

  // Order
  const [orderBusy, setOrderBusy] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  // ── OTP flow ──────────────────────────────────────────────────────────────
  const sendOtp = async () => {
    setAuthError("");
    const cleaned = phone.trim().replace(/\s+/g, "");
    if (!cleaned) {
      setAuthError("Please enter your mobile number.");
      return;
    }
    setAuthBusy(true);
    try {
      const data = await fetchJson("/api/auth/request-otp", {
        method: "POST",
        body: JSON.stringify({ channel: "phone", target: cleaned }),
      });
      setOtpSent(true);
      if (data?.developmentOtp) {
        setDevOtpHint(`Dev OTP: ${data.developmentOtp}`);
      }
    } catch (e) {
      setAuthError(e.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const verifyOtp = async () => {
    setAuthError("");
    if (!otp.trim()) {
      setAuthError("Please enter the OTP.");
      return;
    }
    setAuthBusy(true);
    try {
      const data = await fetchJson("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          channel: "phone",
          target: phone.trim(),
          code: otp.trim(),
          name: name.trim(),
        }),
      });
      login(data.token, data.user);
      setDevOtpHint("");
      setStep(2);
    } catch (e) {
      setAuthError(e.message);
    } finally {
      setAuthBusy(false);
    }
  };

  // ── Place order ───────────────────────────────────────────────────────────
  const placeOrder = async () => {
    setOrderError("");
    setOrderBusy(true);
    try {
      const body = {
        items: items.map((l) => ({ productId: l.productId || l._id, qty: l.qty })),
        deliveryDate: new Date(deliveryDate + "T12:00:00").toISOString(),
        deliverySlot,
        deliveryArea,
        paymentMethod,
      };
      const res = await authFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Order failed (${res.status})`);
      setOrderSuccess(data);
      clear();
    } catch (e) {
      setOrderError(e.message);
    } finally {
      setOrderBusy(false);
    }
  };

  // ── Empty cart ─────────────────────────────────────────────────────────────
  if (items.length === 0 && !orderSuccess) {
    return (
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <span className="text-5xl">🛒</span>
        <h1 className="mt-4 text-2xl font-bold text-orange-900">Your cart is empty</h1>
        <p className="mt-2 text-orange-700">Add some fruits, juices or a salad bowl first.</p>
        <Link
          to="/menu"
          className="mt-6 inline-block rounded-full bg-orange-600 px-7 py-3 font-bold text-white hover:bg-orange-700"
        >
          Browse Menu →
        </Link>
      </main>
    );
  }

  // ── Order success ──────────────────────────────────────────────────────────
  if (orderSuccess) {
    const areaLabel = DELIVERY_AREAS.find((a) => a.value === deliveryArea)?.label || deliveryArea;
    const slotLabel = DELIVERY_SLOTS.find((s) => s.value === deliverySlot)?.label || deliverySlot;
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-3xl border border-green-200 bg-green-50 p-10 shadow-sm">
          <span className="text-6xl">🎉</span>
          <h1 className="mt-4 text-2xl font-extrabold text-green-900">Order Placed!</h1>
          <p className="mt-2 text-green-800">
            Your fresh order is confirmed. We'll get it ready for your slot.
          </p>
          <div className="mt-6 rounded-xl border border-green-200 bg-white p-4 text-left space-y-2">
            <p className="text-sm text-green-800"><strong>📍 Area:</strong> {areaLabel}</p>
            <p className="text-sm text-green-800"><strong>⏰ Slot:</strong> {slotLabel}</p>
            <p className="text-sm text-green-800"><strong>💵 Payment:</strong> Cash on Delivery</p>
            <p className="text-sm text-green-800">
              <strong>🔖 Order ID:</strong>{" "}
              <code className="rounded bg-green-100 px-1.5 py-0.5 text-xs">{orderSuccess._id}</code>
            </p>
          </div>
          <Link
            to="/menu"
            className="mt-6 inline-block rounded-full bg-orange-600 px-7 py-3 font-bold text-white hover:bg-orange-700"
          >
            Order more →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-bold text-orange-900 mb-1">Checkout</h1>
      <p className="text-sm text-orange-600 mb-6">
        Delivery fee: ₹{DELIVERY_FEE} • Order by midnight for next-day delivery
      </p>

      <StepBar current={step} />

      {/* ── STEP 1: Mobile Verification ── */}
      {step === 1 && (
        <section className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-orange-950 mb-1">📱 Verify Mobile Number</h2>
          <p className="text-sm text-orange-700 mb-5">
            We'll send a one-time OTP to confirm your number.
          </p>

          <label className="block text-sm font-semibold text-orange-900 mb-1">
            Mobile Number
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-orange-200 px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              inputMode="tel"
              autoComplete="tel"
              disabled={otpSent}
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={authBusy || otpSent}
              className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 transition"
            >
              {otpSent ? "Sent ✓" : authBusy ? "Sending…" : "Send OTP"}
            </button>
          </div>

          {devOtpHint && (
            <p className="mt-3 rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-900 font-medium">
              {devOtpHint}
            </p>
          )}

          {otpSent && (
            <>
              <label className="mt-4 block text-sm font-semibold text-orange-900 mb-1">
                Enter OTP
              </label>
              <input
                className="w-full rounded-xl border border-orange-200 px-3 py-2.5 text-sm tracking-widest focus:outline-none focus:border-orange-400"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputMode="numeric"
                placeholder="_ _ _ _ _ _"
                maxLength={6}
              />

              <label className="mt-4 block text-sm font-semibold text-orange-900 mb-1">
                Your Name <span className="text-orange-400 font-normal">(optional)</span>
              </label>
              <input
                className="w-full rounded-xl border border-orange-200 px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rohan"
              />

              <button
                type="button"
                onClick={verifyOtp}
                disabled={authBusy}
                className="mt-5 w-full rounded-full bg-orange-700 py-3 font-bold text-white hover:bg-orange-800 disabled:opacity-60 transition"
              >
                {authBusy ? "Verifying…" : "Verify & Continue →"}
              </button>

              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(""); setDevOtpHint(""); }}
                className="mt-2 w-full text-sm text-orange-600 underline"
              >
                Change number
              </button>
            </>
          )}

          {authError && (
            <p className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {authError}
            </p>
          )}
        </section>
      )}

      {/* ── STEP 2: Pick Slot ── */}
      {step === 2 && (
        <section className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
          {isLoggedIn && (
            <div className="mb-5 flex items-center justify-between rounded-xl bg-orange-50 border border-orange-100 px-4 py-2.5">
              <p className="text-sm text-orange-900 font-medium">
                📱 {user?.phone || user?.email || "Verified"}
              </p>
              <button onClick={() => logout()} className="text-xs text-orange-600 underline">
                Sign out
              </button>
            </div>
          )}

          <h2 className="text-lg font-bold text-orange-950 mb-1">⏰ Choose Delivery Slot</h2>
          <p className="text-sm text-orange-700 mb-5">When do you want your order delivered?</p>

          <label className="block text-sm font-semibold text-orange-900 mb-2">Delivery Date</label>
          <input
            type="date"
            min={minDeliveryDateStr()}
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full rounded-xl border border-orange-200 px-3 py-2.5 text-sm mb-5 focus:outline-none focus:border-orange-400"
          />

          <p className="text-sm font-semibold text-orange-900 mb-3">Time Slot</p>
          <div className="grid gap-3">
            {DELIVERY_SLOTS.map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => setDeliverySlot(slot.value)}
                className={`rounded-xl border p-4 text-left transition ${
                  deliverySlot === slot.value
                    ? "border-orange-600 bg-orange-600 text-white"
                    : "border-orange-200 bg-white text-orange-900 hover:border-orange-400"
                }`}
              >
                <p className="font-bold text-base">🕐 {slot.label}</p>
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={!deliverySlot}
            onClick={() => setStep(3)}
            className="mt-6 w-full rounded-full bg-orange-600 py-3 font-bold text-white hover:bg-orange-700 disabled:bg-orange-200 disabled:text-orange-400 disabled:cursor-not-allowed transition"
          >
            Continue → Select Area
          </button>
        </section>
      )}

      {/* ── STEP 3: Select Area ── */}
      {step === 3 && (
        <section className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-orange-950 mb-1">📍 Select Delivery Area</h2>
          <p className="text-sm text-orange-700 mb-5">Where should we deliver on campus?</p>

          <div className="grid gap-3">
            {DELIVERY_AREAS.map((area) => (
              <button
                key={area.value}
                type="button"
                onClick={() => setDeliveryArea(area.value)}
                className={`rounded-xl border p-4 text-left transition ${
                  deliveryArea === area.value
                    ? "border-orange-600 bg-orange-600 text-white"
                    : "border-orange-200 bg-white text-orange-900 hover:border-orange-400"
                }`}
              >
                <p className="font-bold text-base">📌 {area.label}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 rounded-full border-2 border-orange-200 py-3 font-bold text-orange-700 hover:border-orange-400 transition"
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={!deliveryArea}
              onClick={() => setStep(4)}
              className="flex-1 rounded-full bg-orange-600 py-3 font-bold text-white hover:bg-orange-700 disabled:bg-orange-200 disabled:text-orange-400 disabled:cursor-not-allowed transition"
            >
              Review Order →
            </button>
          </div>
        </section>
      )}

      {/* ── STEP 4: Confirm ── */}
      {step === 4 && (
        <section className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-orange-950 mb-5">🧾 Review & Confirm</h2>

          {/* Cart items */}
          <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4 mb-4 space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-orange-900">
                <span>{item.name || item.productId} × {item.qty}</span>
                <span className="font-semibold">₹{item.price * item.qty}</span>
              </div>
            ))}
            <div className="border-t border-orange-200 pt-2 flex justify-between text-sm text-orange-700">
              <span>Delivery fee</span>
              <span>₹{DELIVERY_FEE}</span>
            </div>
            <div className="flex justify-between font-bold text-orange-950 text-base">
              <span>Total</span>
              <span>₹{total + DELIVERY_FEE}</span>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-orange-100 p-4 space-y-2 mb-4">
            <p className="text-sm text-orange-800">
              <strong>⏰ Slot:</strong>{" "}
              {DELIVERY_SLOTS.find((s) => s.value === deliverySlot)?.label}
              {" on "}
              {new Date(deliveryDate + "T00:00:00").toLocaleDateString("en-IN", {
                weekday: "short", day: "numeric", month: "short",
              })}
            </p>
            <p className="text-sm text-orange-800">
              <strong>📍 Area:</strong>{" "}
              {DELIVERY_AREAS.find((a) => a.value === deliveryArea)?.label}
            </p>
            <p className="text-sm text-orange-800">
              <strong>💵 Payment:</strong> Cash on Delivery (COD)
            </p>
            <p className="text-sm text-orange-800">
              <strong>📱 Mobile:</strong> {user?.phone || user?.email || "Verified"}
            </p>
          </div>

          {orderError && (
            <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {orderError}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 rounded-full border-2 border-orange-200 py-3 font-bold text-orange-700 hover:border-orange-400 transition"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={placeOrder}
              disabled={orderBusy}
              className="flex-1 rounded-full bg-green-600 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-60 transition"
            >
              {orderBusy ? "Placing…" : "✅ Place Order"}
            </button>
          </div>
        </section>
      )}

      {/* Cart summary sidebar at bottom always */}
      {step > 1 && (
        <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50/60 px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-orange-700">{items.length} item(s) in cart</p>
          <p className="font-bold text-orange-900">₹{total + DELIVERY_FEE} incl. delivery</p>
        </div>
      )}
    </main>
  );
}
