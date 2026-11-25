import { Link } from "react-router-dom";
import FoodCard from "../components/organisms/FoodCard";
import LoadingSpinner from "../components/atoms/Loading";
import useRecipes from "../hooks/useRecipes";
import { useCart } from "../context/CartContext";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

const Home = () => {
  const { recipes, loading, error, refetch } = useRecipes();
  const { addToCart } = useCart();

  const [featuredRef, featuredVisible] = useRevealOnScroll();
  const [flowRef, flowVisible] = useRevealOnScroll();
  const [closingRef, closingVisible] = useRevealOnScroll();

  const featuredRecipes = recipes.slice(0, 4);

  return (
    <div>
      {/* Hero asymmetric */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">
          <div className="lg:col-span-6">
            <h1 className="km-hero-enter font-[var(--font-display)] text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.12] tracking-tight text-[#1C1917]">
              Masakan hangat dari dapur, langsung ke meja Anda.
            </h1>

            <p className="km-hero-enter km-hero-delay-1 mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#57534E]">
              Pilih hidangan harian favorit, sesuaikan porsi di keranjang, lalu
              kirim detail pesanan Anda lewat email dalam hitungan detik.
            </p>

            <div className="km-hero-enter km-hero-delay-2 mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/menu"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#C2410C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#9A3412]"
              >
                Lihat Daftar Menu
              </Link>
              <Link
                to="/cart"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#E7E2DA] bg-white px-5 py-3 text-sm font-semibold text-[#1C1917] transition-colors hover:border-[#C2410C]/40 hover:bg-[#F3EFEA]"
              >
                Buka Keranjang
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="km-hero-image-enter overflow-hidden rounded-3xl border border-[#E7E2DA] bg-[#F3EFEA]">
              <img
                src="https://images.unsplash.com/photo-1652862730489-709af913391f?auto=format&fit=crop&w=1200&q=80"
                alt="Hidangan hangat pilihan KitaMakan"
                width={720}
                height={540}
                fetchPriority="high"
                className="aspect-[4/3] w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sajian pilihan */}
      <section className="border-y border-[#E7E2DA] bg-[#F3EFEA] py-14 sm:py-16">
        <div
          ref={featuredRef}
          className={`km-reveal mx-auto max-w-6xl px-4 sm:px-6 ${
            featuredVisible ? "is-visible" : ""
          }`}
        >
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#1C1917]">
                Sajian Pilihan Hari Ini
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-[#57534E]">
                Beberapa hidangan yang siap Anda pesan langsung dari halaman ini.
              </p>
            </div>
            <Link
              to="/menu"
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[#C2410C] hover:text-[#9A3412] transition-colors"
            >
              Semua menu →
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner label="Menyiapkan sajian pilihan..." />
          ) : error ? (
            <div className="rounded-2xl border border-[#E7E2DA] bg-white p-6 text-center">
              <p className="text-sm text-[#57534E]">{error}</p>
              <button
                type="button"
                onClick={refetch}
                className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#C2410C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9A3412]"
              >
                Muat Ulang
              </button>
            </div>
          ) : featuredRecipes.length === 0 ? (
            <div className="rounded-2xl border border-[#E7E2DA] bg-white p-6 text-center text-sm text-[#57534E]">
              Belum ada sajian yang tersedia saat ini.
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredRecipes.map((recipe) => (
                <li key={recipe.id}>
                  <FoodCard
                    item={recipe}
                    onAddToCart={() =>
                      addToCart({
                        id: recipe.id,
                        name: recipe.name,
                        image: recipe.image,
                        price: recipe.price,
                        category: recipe.category,
                        quantity: 1,
                      })
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Alur pemesanan */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16">
        <div
          ref={flowRef}
          className={`km-reveal grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 ${
            flowVisible ? "is-visible" : ""
          }`}
        >
          <div className="lg:col-span-5">
            <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#1C1917]">
              Cara memesan di KitaMakan
            </h2>
            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#57534E]">
              Tidak perlu akun atau proses panjang. Semua pesanan dirangkum rapi
              dan langsung dikirim melalui email Anda.
            </p>
          </div>

          <div className="lg:col-span-7 divide-y divide-[#E7E2DA] border-y border-[#E7E2DA]">
            <div className="flex items-start gap-5 py-5">
              <span className="font-[var(--font-display)] text-xl font-bold text-[#C2410C] tabular-nums">
                01
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#1C1917]">
                  Cari dan pilih hidangan
                </h3>
                <p className="mt-1 text-sm text-[#57534E]">
                  Saring daftar menu berdasarkan kategori atau ketik nama makanan
                  yang Anda inginkan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 py-5">
              <span className="font-[var(--font-display)] text-xl font-bold text-[#C2410C] tabular-nums">
                02
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#1C1917]">
                  Atur porsi di keranjang
                </h3>
                <p className="mt-1 text-sm text-[#57534E]">
                  Tambah atau kurangi jumlah tiap hidangan, lalu periksa total
                  harga secara langsung.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 py-5">
              <span className="font-[var(--font-display)] text-xl font-bold text-[#C2410C] tabular-nums">
                03
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#1C1917]">
                  Checkout lewat email
                </h3>
                <p className="mt-1 text-sm text-[#57534E]">
                  Isi nama dan email Anda, lalu kirim ringkasan pesanan langsung
                  dari halaman keranjang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing band */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div
          ref={closingRef}
          className={`km-reveal flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-3xl bg-[#1C1917] px-6 sm:px-10 py-10 text-[#FAF8F5] ${
            closingVisible ? "is-visible" : ""
          }`}
        >
          <div>
            <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold">
              Sudah siap memilih makan siang atau malam?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#D6D3D1]">
              Jelajahi seluruh menu dan tambahkan hidangan pilihan Anda ke keranjang.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-[#C2410C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#9A3412]"
          >
            Buka Halaman Menu
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
