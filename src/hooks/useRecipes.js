import { useCallback, useEffect, useMemo, useState } from "react";
import { getRecipes } from "../services/recipeServices";
import { normalizeRecipe } from "../utils/formatters";

const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRecipes = useCallback(async () => {
    const data = await getRecipes();
    const list = Array.isArray(data?.recipes) ? data.recipes : [];
    return list.map(normalizeRecipe);
  }, []);

  useEffect(() => {
    let active = true;

    loadRecipes()
      .then((normalized) => {
        if (!active) return;
        setRecipes(normalized);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || "Gagal memuat daftar menu.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadRecipes]);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const normalized = await loadRecipes();
      setRecipes(normalized);
    } catch (err) {
      setError(err?.message || "Gagal memuat daftar menu.");
    } finally {
      setLoading(false);
    }
  }, [loadRecipes]);

  const categories = useMemo(() => {
    const set = new Set();
    recipes.forEach((recipe) => {
      if (Array.isArray(recipe.mealType) && recipe.mealType.length > 0) {
        recipe.mealType.forEach((type) => set.add(type));
      } else if (recipe.category) {
        set.add(recipe.category);
      }
    });
    return ["Semua", ...Array.from(set)];
  }, [recipes]);

  return { recipes, categories, loading, error, refetch };
};

export default useRecipes;
