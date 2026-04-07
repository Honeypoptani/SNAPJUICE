import { Link } from "react-router-dom";
import { DELIVERY_FEE } from "../lib/constants";
import { useCart } from "../context/CartContext";

export function Cart() {
  const { items, setQty, removeLine, subtotal, total, clear } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-orange-900">Your cart is empty</h1>
        <p className="mt-2 text-orange-800">Add something delicious from the menu.</p>
        <Link
          to="/menu"
          className="mt-6 inline-block rounded-full bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
        >
          Browse menu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-orange-900">Cart</h1>
        <button
          type="button"
          onClick={() => clear()}
          className="text-sm font-medium text-orange-700 underline hover:text-orange-900"
        >
          Clear cart
        </button>
      </div>

      <ul className="mt-8 divide-y divide-orange-200 rounded-lg border border-orange-200 bg-white">
        {items.map((line) => (
          <li key={line.productId} className="flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-orange-900">{line.name}</p>
              <p className="text-sm text-orange-600">
                {line.size} · Rs. {line.price} each
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-8 w-8 rounded border border-orange-300 text-lg leading-none"
                onClick={() => setQty(line.productId, line.qty - 1)}
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{line.qty}</span>
              <button
                type="button"
                className="h-8 w-8 rounded border border-orange-300 text-lg leading-none"
                onClick={() => setQty(line.productId, line.qty + 1)}
              >
                +
              </button>
            </div>
            <p className="font-semibold text-orange-900">
              Rs. {line.price * line.qty}
            </p>
            <button
              type="button"
              onClick={() => removeLine(line.productId)}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-2 rounded-xl border border-orange-200 bg-orange-50/80 p-6 text-orange-900">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rs. {subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Delivery fee</span>
          <span>Rs. {DELIVERY_FEE}</span>
        </div>
        <div className="flex justify-between border-t border-orange-200 pt-2 text-lg font-bold">
          <span>Total</span>
          <span>Rs. {total}</span>
        </div>
      </div>

      <Link
        to="/checkout"
        className="mt-8 inline-block w-full rounded-full bg-orange-600 py-3 text-center font-semibold text-white hover:bg-orange-700 md:w-auto md:px-10"
      >
        Proceed to checkout
      </Link>
    </main>
  );
}
