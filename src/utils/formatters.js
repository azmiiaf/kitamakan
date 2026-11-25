export function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

/**
 * Normalisasi objek resep dari DummyJSON agar memiliki field harga (IDR),
 * kategori utama, dan deskripsi ringkas yang konsisten di Menu maupun Cart.
 */
export function normalizeRecipe(recipe) {
  if (!recipe) return recipe;

  const baseCalories = Number(recipe.caloriesPerServing) || Number(recipe.id || 1) * 45;
  const derivedPrice = 24000 + (Math.round(baseCalories / 15) % 45) * 1000;
  const totalMinutes =
    (Number(recipe.prepTimeMinutes) || 15) + (Number(recipe.cookTimeMinutes) || 15);

  const primaryCategory =
    recipe.category || recipe.mealType?.[0] || recipe.cuisine || "Menu Utama";

  const description =
    recipe.description ||
    `${recipe.cuisine || "Sajian Rumah"} · ${totalMinutes} menit · ${recipe.servings || 2} porsi`;

  return {
    ...recipe,
    price: Number(recipe.price) || derivedPrice,
    category: primaryCategory,
    description,
  };
}
