import { createContext, useContext, useState, useCallback, useEffect } from "react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "kitamakan_cart";

function loadStoredCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [itemCart, setItemCart] = useState(loadStoredCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itemCart));
    } catch {
      // Abaikan jika storage penuh atau diblokir browser
    }
  }, [itemCart]);

  // Tambah item: jika sudah ada, naikkan quantity; jika belum, tambahkan dengan quantity: 1
  const addToCart = useCallback((recipe) => {
    if (!recipe) return;

    setItemCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === recipe.id);

      if (existingIndex !== -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...prev, { ...recipe, quantity: 1 }];
    });
  }, []);

  const onIncreaseQty = useCallback((id) => {
  setItemCart(prev => prev.map(item => item.id === id ? {...item, quantity:(item.quantity+1)}:item))
  },[])

  
  // Kurangi quantity: jika quantity > 1 kurangi 1, jika 1 maka hapus item
  // const onDecreaseQty = useCallback((itemId) => {
  //   setItemCart((prev) =>
  //     prev
  //       .map((item) =>
  //         item.id === itemId
  //           ? { ...item, quantity: (item.quantity || 1) - 1 }
  //           : item
  //       )
  //       .filter((item) => item.quantity > 0)
  //   );
  // }, []);

  const onDecreaseQty = (itemId) => {
    setItemCart((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Hapus item tertentu berdasarkan index
  const removeFromCart = useCallback((indexToRemove) => {
    setItemCart((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }, []);

  // Reset cart
  const clearCart = useCallback(() => {
    setItemCart([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        itemCart,
        addToCart,
        onIncreaseQty,
        onDecreaseQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus dipakai di dalam <CartProvider>");
  }
  return context;
}

export { CartContext };