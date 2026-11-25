import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
      <h1 className="font-[var(--font-display)] text-4xl font-bold text-[#1C1917]">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-3 text-sm sm:text-base text-[#57534E]">
        Alamat yang Anda buka tidak tersedia di KitaMakan.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#C2410C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9A3412]"
      >
        Kembali ke Home
      </Link>
    </section>
  );
};

export default NotFound;
