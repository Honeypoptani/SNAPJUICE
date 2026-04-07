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
  PAYMENT_METHODS,
} from "../lib/constants";

export function Checkout() {
  const { items, total, clear } = useCart();
  const { isLoggedIn, user, login, logout, authFetch } = useAuth();

  const [channel, setChannel] = useState("phone");
  const [target, setTarget] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [devOtpHint, setDevOtpHint] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");

  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDateStr());
  const [deliverySlot, setDeliverySlot] = useState("1pm");
  const [deliveryArea, setDeliveryArea] = useState("cg");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [orderBusy, setOrderBusy] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  const requestOtp = async () => {
    setAuthError("");
    setDevOtpHint("");
    if (!target.trim()) {
      setAuthError("Enter your phone or email.");
      return;
    }
    setAuthBusy(true);
    try {
      const data = await fetchJson("/api/auth/request-otp", {
        method: "POST",
        body: JSON.stringify({ channel, target: target.trim() }),
      });
      if (data?.developmentOtp) {
        setDevOtpHint(`Dev OTP (use this code): ${data.developmentOtp}`);
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
      setAuthError("Enter the OTP.");
      return;
    }
    setAuthBusy(true);
    try {
      const data = await fetchJson("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          channel,
          target: target.trim(),
          code: otp.trim(),
          name: name.trim(),
        }),
      });
      login(data.token, data.user);
      setDevOtpHint("");
    } catch (e) {
      setAuthError(e.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setOrderError("");
    setOrderSuccess(null);
    if (items.length === 0) {
      setOrderError("Your cart is empty.");
      return;
    }
    setOrderBusy(true);
    try {
      const body = {
        items: items.map((l) => ({
          productId: l.productId,
          qty: l.qty,
        })),
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
      if (!res.ok) {
        throw new Error(data.message || `Order failed (${res.status})`);
      }
      setOrderSuccess(data);
      clear();
    } catch (e) {
      setOrderError(e.message);
    } finally {
      setOrderBusy(false);
    }
  };

  if (orderSuccess) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-4xl">🎉</p>
        <h1 className="mt-4 text-2xl font-bold text-orange-900">Order placed!</h1>
        <p className="mt-2 text-orange-800">
          We&apos;ll prepare your juice & fruit for the slot you picked.
        </p>
        <p className="mt-4 text-sm text-orange-700">
          Order ID: <code className="rounded bg-orange-100 px-2 py-0.5">{orderSuccess._id}</code>
        </p>
        <Link
          to="/menu"
          className="mt-8 inline-block rounded-full bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
        >
          Order more
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-orange-900">Nothing to checkout</h1>
        <p className="mt-2 text-orange-800">Add items to your cart first.</p>
        <Link
          to="/menu"
          className="mt-6 inline-block rounded-full bg-orange-600 px-6 py-3 font-semibold text-white"
        >
          Go to menu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-orange-900">Checkout</h1>
      <p className="mt-2 text-orange-800">
        Order by midnight for next-day delivery. Fixed fee: Rs. {DELIVERY_FEE}.
      </p>

      {!isLoggedIn ? (
        <section className="mt-8 rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-orange-950">Sign in (OTP)</h2>
          <p className="mt-1 text-sm text-orange-700">
            We&apos;ll send a one-time code (dev mode shows the code on screen).
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setChannel("phone")}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                channel === "phone"
                  ? "bg-orange-700 text-white"
                  : "bg-orange-100 text-orange-900"
              }`}
            >
              Phone
            </button>
            <button
              type="button"
              onClick={() => setChannel("email")}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                channel === "email"
                  ? "bg-orange-700 text-white"
                  : "bg-orange-100 text-orange-900"
              }`}
            >
              Email
            </button>
          </div>

          <label className="mt-4 block text-sm font-medium text-orange-900">
            {channel === "phone" ? "Phone number" : "Email"}
            <input
              className="mt-1 w-full rounded-lg border border-orange-200 px-3 py-2"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={channel === "phone" ? "+919876543210" : "you@campus.edu"}
              autoComplete="tel"
            />
          </label>

          <button
            type="button"
            onClick={requestOtp}
            disabled={authBusy}
            className="mt-3 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Send OTP
          </button>

          {devOtpHint && (
            <p className="mt-3 rounded-lg bg-amber-100 px-3 py-2 text-sm text-amber-950">
              {devOtpHint}
            </p>
          )}

          <label className="mt-4 block text-sm font-medium text-orange-900">
            OTP code
            <input
              className="mt-1 w-full rounded-lg border border-orange-200 px-3 py-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputMode="numeric"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-orange-900">
            Your name (optional)
            <input
              className="mt-1 w-full rounded-lg border border-orange-200 px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <button
            type="button"
            onClick={verifyOtp}
            disabled={authBusy}
            className="mt-4 rounded-full bg-orange-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Verify & continue
          </button>

          {authError && (
            <p className="mt-3 text-sm text-red-700">{authError}</p>
          )}
        </section>
      ) : (
        <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-orange-200 bg-orange-50/80 px-4 py-3">
          <p className="text-sm text-orange-900">
            Signed in as{" "}
            <strong>{user?.phone || user?.email || "user"}</strong>
          </p>
          <button
            type="button"
            onClick={() => logout()}
            className="text-sm font-medium text-orange-800 underline"
          >
            Sign out
          </button>
        </section>
      )}

      {isLoggedIn && (
        <form
          onSubmit={placeOrder}
          className="mt-8 space-y-6 rounded-2xl border border-orange-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-orange-950">Delivery</h2>

          <label className="block text-sm font-medium text-orange-900">
            Delivery date (next day or later)
            <input
              type="date"
              required
              min={minDeliveryDateStr()}
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-orange-200 px-3 py-2"
            />
          </label>

          <label className="block text-sm font-medium text-orange-900">
            Time slot
            <select
              value={deliverySlot}
              onChange={(e) => setDeliverySlot(e.target.value)}
              className="mt-1 w-full rounded-lg border border-orange-200 px-3 py-2"
            >
              {DELIVERY_SLOTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-orange-900">
            Area
            <select
              value={deliveryArea}
              onChange={(e) => setDeliveryArea(e.target.value)}
              className="mt-1 w-full rounded-lg border border-orange-200 px-3 py-2"
            >
              {DELIVERY_AREAS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-orange-900">
            Payment
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 w-full rounded-lg border border-orange-200 px-3 py-2"
            >
              {PAYMENT_METHODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-lg bg-orange-50 px-4 py-3 text-orange-900">
            <p className="flex justify-between font-semibold">
              <span>Total</span>
              <span>Rs. {total}</span>
            </p>
          </div>

          {orderError && (
            <p className="text-sm text-red-700">{orderError}</p>
          )}

          <button
            type="submit"
            disabled={orderBusy}
            className="w-full rounded-full bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700 disabled:opacity-60 md:w-auto md:px-12"
          >
            {orderBusy ? "Placing order…" : "Place order"}
          </button>
        </form>
      )}
    </main>
  );
}
