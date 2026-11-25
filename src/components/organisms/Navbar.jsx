import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { itemCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalItems = itemCart.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
      isActive
        ? "text-[#C2410C] bg-[#FFF7ED]"
        : "text-[#1C1917] hover:text-[#C2410C] hover:bg-[#F3EFEA]"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#E7E2DA] bg-[#FAF8F5]/95 backdrop-blur-sm">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 h-16"
      >
        <NavLink
          to="/"
          end
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 rounded-lg py-1 pr-2"
        >
          <img
            src="/images/logo.png"
            alt="KitaMakan"
            width={150}
            height={10}
            className="h-15 w-auto object-contain"
          />
        </NavLink>

        {/* Desktop navigation */}
        <div className="hidden sm:flex items-center gap-2">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/menu" end className={navLinkClass}>
            Menu
          </NavLink>
          <NavLink
            to="/cart"
            end
            aria-label={`Cart (${totalItems} item)`}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive
                  ? "text-[#C2410C] bg-[#FFF7ED]"
                  : "text-[#1C1917] hover:text-[#C2410C] hover:bg-[#F3EFEA]"
              }`
            }
          >
            <span>Cart</span>
            <span
              className={`inline-flex min-w-[22px] h-[22px] items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums transition-colors ${
                totalItems > 0
                  ? "bg-[#C2410C] text-white"
                  : "bg-[#E7E2DA] text-[#57534E]"
              }`}
            >
              {totalItems}
            </span>
          </NavLink>
        </div>

        {/* Mobile cart shortcut + menu toggle */}
        <div className="flex sm:hidden items-center gap-1.5">
          <NavLink
            to="/cart"
            end
            onClick={() => setMobileOpen(false)}
            aria-label={`Cart (${totalItems} item)`}
            className={({ isActive }) =>
              `inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg text-sm font-semibold transition-colors ${
                isActive ? "bg-[#FFF7ED] text-[#C2410C]" : "text-[#1C1917]"
              }`
            }
          >
            <span>Cart</span>
            <span
              className={`inline-flex min-w-[22px] h-[22px] items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums ${
                totalItems > 0
                  ? "bg-[#C2410C] text-white"
                  : "bg-[#E7E2DA] text-[#57534E]"
              }`}
            >
              {totalItems}
            </span>
          </NavLink>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#E7E2DA] bg-white text-[#1C1917] hover:bg-[#F3EFEA]"
          >
            {mobileOpen ? (
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          className="sm:hidden border-t border-[#E7E2DA] bg-[#FAF8F5] px-4 py-3 flex flex-col gap-1"
        >
          <NavLink
            to="/"
            end
            onClick={() => setMobileOpen(false)}
            className={navLinkClass}
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            end
            onClick={() => setMobileOpen(false)}
            className={navLinkClass}
          >
            Menu
          </NavLink>
          <NavLink
            to="/cart"
            end
            onClick={() => setMobileOpen(false)}
            className={navLinkClass}
          >
            Cart ({totalItems})
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
