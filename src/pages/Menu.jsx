import { useMemo, useState } from "react";
import FoodCard from "../components/organisms/FoodCard";
import useRecipes from "../hooks/useRecipes";
import { useCart } from "../context/CartContext";
import LoadingSpinner from "../components/atoms/Loading";

const Menu = () => {
  const { recipes, categories, loading, error, refetch } = useRecipes();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return recipes.filter((recipe) => {
      const matchesCategory =
        selectedCategory === "Semua" ||
        recipe.category === selectedCategory ||
        (Array.isArray(recipe.mealType) &&
          recipe.mealType.includes(selectedCategory));

      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        recipe.name,
        recipe.cuisine,
        recipe.category,
        ...(Array.isArray(recipe.tags) ? recipe.tags : []),
        ...(Array.isArray(recipe.mealType) ? recipe.mealType : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [recipes, searchQuery, selectedCategory]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <LoadingSpinner label="Menyiapkan daftar menu..." />
      </div>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="rounded-2xl border border-[#E7E2DA] bg-white p-8 text-center">
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-[#1C1917]">
            Gagal Memuat Menu
          </h1>
          <p className="mt-2 text-sm text-[#57534E]">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#C2410C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9A3412]"
          >
            Muat Ulang
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-[#1C1917]">
            Daftar Menu
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#57534E]">
            Pilih hidangan yang Anda suka atau saring berdasarkan kategori.
          </p>
        </div>

        {/* Search input */}
        <div className="w-full md:w-80">
          <label
            htmlFor="menu-search"
            className="mb-1.5 block text-xs font-semibold text-[#57534E]"
          >
            Cari menu
          </label>
          <div className="relative">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#57534E]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.3-4.3" />
            </svg>
            <input
              id="menu-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama makanan atau jenis..."
              className="h-11 w-full rounded-xl border border-[#E7E2DA] bg-white pl-10 pr-10 text-sm text-[#1C1917] placeholder:text-[#78716C] focus:border-[#C2410C] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Hapus pencarian"
                className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#57534E] hover:bg-[#F3EFEA] hover:text-[#1C1917]"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div
        role="group"
        aria-label="Filter kategori menu"
        className="mb-6 flex flex-wrap items-center gap-2"
      >
        {categories.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedCategory(category)}
              className={`inline-flex min-h-[44px] items-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-[#C2410C] text-white"
                  : "border border-[#E7E2DA] bg-white text-[#1C1917] hover:border-[#C2410C]/40 hover:bg-[#F3EFEA]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <p className="mb-5 text-xs font-medium text-[#57534E]">
        Menampilkan {filteredRecipes.length} dari {recipes.length} hidangan
      </p>

      {filteredRecipes.length === 0 ? (
        <div className="rounded-2xl border border-[#E7E2DA] bg-white p-10 text-center">
          <p className="text-base font-semibold text-[#1C1917]">
            Tidak ada menu yang cocok
          </p>
          <p className="mt-1.5 text-sm text-[#57534E]">
            Coba ubah kata kunci pencarian atau pilih kategori lain.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#C2410C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9A3412]"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
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
    </section>
  );
};

export default Menu;
