# Snap Juice

Web app: **Home** (hero + how it works), **Menu** (categories + add to cart), **Cart** (qty + totals), **Checkout** (phone/email OTP sign-in, delivery slot/area, UPI/COD, place order).

## Local setup

### Backend (`server/`)

1. Copy `server/.env.example` → `server/.env` and set `MONGODB_URI`, `JWT_SECRET`, and optionally `PORT` (default **`5050`** — avoid **`5000`** on macOS; see troubleshooting).
2. `cd server && npm install && npm run dev`

### Seed sample menu (optional)

```bash
cd server && npm run seed
```

### Frontend (`client/`)

1. `cd client && npm install && npm run dev`
2. The browser loads **`/api/...`** from the same origin; **Vite proxies** that to your Node server (default **`http://127.0.0.1:5050`**).
3. If your API port is **not 5050**, create `client/.env`:

   ```env
   VITE_API_PROXY_TARGET=http://127.0.0.1:YOUR_PORT
   ```

4. Restart `npm run dev` after changing `client/.env`.

### Quick checks

- API health: open `http://127.0.0.1:5050/api/health` (use your `PORT` from `server/.env`).
- Products: `http://127.0.0.1:5050/api/products` should return `[]` or a JSON array.

### Troubleshooting: **403** on `/api/products`

On **macOS**, **port 5000** is often used by **AirPlay Receiver**. If Vite proxies to `5000` but your API runs elsewhere (or the wrong service answers), you can get **403**.

**Fix:** Set `PORT=5050` in `server/.env`, set `VITE_API_PROXY_TARGET=http://127.0.0.1:5050` in `client/.env` if needed, restart both servers. Or disable AirPlay Receiver: **System Settings → General → AirDrop & Handoff → AirPlay Receiver → Off**.
