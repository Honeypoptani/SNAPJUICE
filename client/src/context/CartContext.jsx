import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DELIVERY_FEE } from "../lib/constants";

const CartContext = createContext(null);

const STORAGE_KEY = "snapjuice_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const id = String(product._id);
      const existing = prev.find((l) => l.productId === id);
      if (existing) {
        return prev.map((l) =>
          l.productId === id ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [
        ...prev,
        {
          productId: id,
          name: product.name,
          size: product.size,
          price: product.price,
          category: product.category,
          qty,
        },
      ];
    });
  };

  const setQty = (productId, qty) => {
    if (qty < 1) {
      setItems((prev) => prev.filter((l) => l.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((l) => (l.productId === productId ? { ...l, qty } : l))
    );
  };

  const removeLine = (productId) => {
    setItems((prev) => prev.filter((l) => l.productId !== productId));
  };

  const clear = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((s, l) => s + l.price * l.qty, 0),
    [items]
  );

  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  const value = useMemo(
    () => ({
      items,
      addItem,
      setQty,
      removeLine,
      clear,
      subtotal,
      total,
      itemCount: items.reduce((n, l) => n + l.qty, 0),
    }),
    [items, subtotal, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
