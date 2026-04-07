import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  if (isLoggedIn) {
    navigate("/menu");
    return null;
  }

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await fetchJson("/api/auth/request-otp", {
        method: "POST",
        body: JSON.stringify({ channel: "email", target: email }),
      });
      setStep("otp");
      setError(`Dev OTP (server console): ${data.developmentOtp}`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await fetchJson("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ channel: "email", target: email, code: otp, name }),
      });
      login(data.token, data.user);
      navigate("/menu");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
      <div className="w-full rounded-2xl bg-white p-8 shadow-xl">
        <div className="mx-auto mb-8 w-24">
          <img src="/icons.svg" alt="SnapJuice" className="h-24 w-24" />
        </div>
        <h1 className="text-2xl font-bold text-orange-900">Welcome to SnapJuice</h1>
        <p className="mt-2 text-orange-700">Verify email to continue</p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>
        )}

        {step === "email" && (
          <form onSubmit={handleRequestOtp} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-orange-900">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-orange-200 px-4 py-3 text-lg shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                placeholder="your@email.com"
              />
            </div>
            <button
              disabled={loading}
              className="w-full rounded-full bg-orange-600 px-6 py-3 font-semibold text-white disabled:opacity-50 hover:bg-orange-700"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-orange-900">
                Email (sent to {email})
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-lg"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-orange-900">OTP (6 digits)</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                className="w-full rounded-xl border border-orange-200 px-4 py-3 text-lg shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                placeholder="123456"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-orange-900">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-orange-200 px-4 py-3 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                placeholder="Your name"
              />
            </div>
            <button
              disabled={loading || otp.length !== 6}
              className="w-full rounded-full bg-orange-600 px-6 py-3 font-semibold text-white disabled:opacity-50 hover:bg-orange-700"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-orange-600">
          Questions? Reply to the email.
        </p>
      </div>
    </main>
  );
}

