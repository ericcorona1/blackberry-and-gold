import { Outlet, Link } from "react-router-dom";
import { useStore } from "@/store";

const GOLD = "#d4a843";
const DARK_GOLD = "#b8922e";

export function Layout() {
  const { roomCode, orderId } = useStore();

  return (
    <div className="min-h-screen bg-black text-[#e8d5b7] font-serif">
      <header className="border-b border-[#d4a843]/30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="no-underline">
            <h1
              className="text-xl md:text-2xl font-bold tracking-wider uppercase"
              style={{ color: GOLD }}
            >
              Blackberry & Gold
            </h1>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {roomCode && (
              <Link
                to="/menu"
                className="hover:underline transition-colors"
                style={{ color: DARK_GOLD }}
              >
                Menu
              </Link>
            )}
            {orderId && (
              <Link
                to="/order-status"
                className="hover:underline transition-colors"
                style={{ color: DARK_GOLD }}
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
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
