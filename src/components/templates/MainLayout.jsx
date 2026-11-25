import { Link, Outlet } from "react-router-dom";
import Navbar from "../organisms/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-[#E7E2DA] bg-[#F3EFEA]">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-8 text-sm text-[#57534E]">
          <div>
            <p className="font-semibold text-[#1C1917]">KitaMakan</p>
            <p className="mt-1">
              Sajian hangat dari dapur kami, dipesan langsung dan dikirim konfirmasinya ke email Anda.
            </p>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <Link to="/" className="hover:text-[#C2410C] transition-colors">
              Home
            </Link>
            <Link to="/menu" className="hover:text-[#C2410C] transition-colors">
              Menu
            </Link>
            <Link to="/cart" className="hover:text-[#C2410C] transition-colors">
              Cart
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
