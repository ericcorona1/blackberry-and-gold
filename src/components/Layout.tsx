import { Outlet, Link, useLocation } from "react-router-dom";
import { useStore } from "@/store";

const GOLD = "#d4a843";
const DARK_GOLD = "#b8922e";

export function Layout() {
  const { roomCode, orderId } = useStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-[#e8d5b7] font-serif">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <header className="border-b border-[#d4a843]/30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="no-underline" aria-label="Home">
            <h1
              className="text-xl md:text-2xl font-bold tracking-wider uppercase"
              style={{ color: GOLD }}
            >
              Blackberry & Gold
            </h1>
          </Link>
          <nav
            aria-label="Main navigation"
            className="flex items-center gap-4 text-sm"
          >
            {roomCode && (
              <Link
                to="/menu"
                className="hover:underline transition-colors"
                style={{ color: DARK_GOLD }}
                aria-current={
                  location.pathname === "/menu" ? "page" : undefined
                }
              >
                Menu
              </Link>
            )}
            {orderId && (
              <Link
                to="/order-status"
                className="hover:underline transition-colors"
                style={{ color: DARK_GOLD }}
                aria-current={
                  location.pathname === "/order-status" ? "page" : undefined
                }
              >
                My Order
              </Link>
            )}
            <Link
              to="/admin"
              className="px-3 py-1 rounded text-sm font-medium transition-colors"
              style={{
                backgroundColor: GOLD,
                color: "#000",
              }}
              aria-current={location.pathname === "/admin" ? "page" : undefined}
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
