import { Link, NavLink, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function Layout() {
  const { itemCount } = useCart();

  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-1.5 text-sm font-medium transition ${
      isActive
        ? "bg-orange-700 text-white"
        : "text-orange-900 hover:bg-orange-100"
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-orange-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="text-xl font-bold tracking-tight text-orange-900">
            Snap Juice<span className="text-orange-600">.</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/menu" className={linkClass}>
              Menu
            </NavLink>
            <NavLink to="/cart" className={linkClass}>
              Cart
              {itemCount > 0 && (
                <span className="ml-1 rounded-full bg-orange-600 px-1.5 text-xs text-white">
                  {itemCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/checkout" className={linkClass}>
              Checkout
            </NavLink>
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="mt-auto border-t border-orange-200 bg-orange-50/80">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-orange-800">
          <p className="font-semibold text-orange-900">Snap Juice</p>
          <p className="mt-1 max-w-md">
            Fresh juice & fruit — order by midnight for next-day delivery on campus.
          </p>
          <p className="mt-4 text-orange-700/80">
            © {new Date().getFullYear()} Snap Juice. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
