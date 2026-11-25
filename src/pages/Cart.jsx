import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/organisms/CartItem";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../utils/formatters";

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || "";

const Cart = () => {
  const { itemCart, clearCart, removeFromCart, onIncreaseQty, onDecreaseQty } =
    useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [copied, setCopied] = useState(false);

  const { totalItems, totalPrice } = useMemo(() => {
    return itemCart.reduce(
      (acc, item) => {
        const qty = item.quantity || 1;
        const price = Number(item.price) || 0;
        acc.totalItems += qty;
        acc.totalPrice += qty * price;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 }
    );
  }, [itemCart]);

  useEffect(() => {
    if (!checkoutOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        setCheckoutOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [checkoutOpen, isSubmitting]);

  const isEmpty = itemCart.length === 0;

  const openCheckoutModal = () => {
    setFormError("");
    setOrderReceipt(null);
    setCopied(false);
    setCheckoutOpen(true);
  };

  const handleCheckoutSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = customerName.trim();
    const trimmedEmail = customerEmail.trim();

    if (!trimmedName || !trimmedEmail) {
      setFormError("Mohon lengkapi nama dan email Anda.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError("Format email belum valid. Periksa kembali alamat email Anda.");
      return;
    }

    const orderCode = `KM-${Date.now().toString().slice(-6)}`;
    const itemsSnapshot = itemCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
      price: Number(item.price) || 0,
    }));

    const itemLines = itemsSnapshot
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} x${item.quantity} (${formatRupiah(
            item.price * item.quantity
          )})`
      )
      .join("\n");

    const plainBody = [
      `Kode Pesanan: ${orderCode}`,
      `Nama Pemesan: ${trimmedName}`,
      `Email Pemesan: ${trimmedEmail}`,
      "",
      "Detail Pesanan:",
      itemLines,
      "",
      `Total Item: ${totalItems}`,
      `Total Bayar: ${formatRupiah(totalPrice)}`,
    ].join("\n");

    if (!WEB3FORMS_KEY) {
      setFormError(
        "Pengiriman email belum dikonfigurasi: tambahkan VITE_WEB3FORMS_KEY di file .env lalu restart server Vite."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Pesanan KitaMakan ${orderCode} - ${trimmedName}`,
          from_name: "KitaMakan",
          name: trimmedName,
          email: trimmedEmail,
          replyto: trimmedEmail,
          message: plainBody,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Gagal mengirim pesanan ke layanan email."
        );
      }

      setOrderReceipt({
        orderCode,
        customerName: trimmedName,
        customerEmail: trimmedEmail,
        items: itemsSnapshot,
        totalItems,
        totalPrice,
        plainBody,
      });

      clearCart();
    } catch (err) {
      setFormError(
        err?.message ||
          "Pengiriman email gagal. Periksa koneksi internet Anda lalu coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrder = async () => {
    if (!orderReceipt?.plainBody) return;
    try {
      await navigator.clipboard.writeText(orderReceipt.plainBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 pb-36">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-[#1C1917]">
              Keranjang Belanja
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-[#57534E]">
              Periksa jumlah porsi sebelum mengirim pesanan ke email kami.
            </p>
          </div>
          {!isEmpty && (
            <Link
              to="/menu"
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[#C2410C] hover:text-[#9A3412]"
            >
              + Tambah menu lain
            </Link>
          )}
        </div>

        {isEmpty ? (
          <div className="rounded-2xl border border-[#E7E2DA] bg-white p-10 text-center">
            <p className="text-base font-semibold text-[#1C1917]">
              Keranjang Anda masih kosong
            </p>
            <p className="mt-1.5 text-sm text-[#57534E]">
              Pilih hidangan dari halaman menu untuk mulai membuat pesanan.
            </p>
            <Link
              to="/menu"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#C2410C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9A3412]"
            >
              Lihat Daftar Menu
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {itemCart.map((item, index) => (
              <li key={item.id}>
                <CartItem
                  item={item}
                  onIncrease={() => onIncreaseQty(item.id)}
                  onDecrease={() => onDecreaseQty(item.id)}
                  onRemove={() => removeFromCart(index)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Ringkasan sticky di bawah */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E7E2DA] bg-white/95 backdrop-blur-sm px-4 py-3.5">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm text-[#57534E]">
              Total Item:{" "}
              <span className="font-semibold text-[#1C1917] tabular-nums">
                {totalItems}
              </span>
            </p>
            <p className="text-lg sm:text-xl font-bold text-[#1C1917] tabular-nums">
              {formatRupiah(totalPrice)}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={clearCart}
              disabled={isEmpty}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#E7E2DA] bg-[#FAF8F5] px-4 py-2 text-sm font-semibold text-[#1C1917] transition-colors hover:bg-[#F3EFEA] disabled:opacity-40"
            >
              Kosongkan
            </button>
            <button
              type="button"
              onClick={openCheckoutModal}
              disabled={isEmpty}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#C2410C] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#9A3412] disabled:opacity-40"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Modal Checkout via Email */}
      {checkoutOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/50 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !isSubmitting) {
              setCheckoutOpen(false);
            }
          }}
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E7E2DA] bg-[#FAF8F5] p-6 sm:p-7 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[#E7E2DA] pb-4">
              <div>
                <h2
                  id="checkout-modal-title"
                  className="font-[var(--font-display)] text-2xl font-bold text-[#1C1917]"
                >
                  {orderReceipt ? "Pesanan Terkirim" : "Checkout Pesanan"}
                </h2>
                <p className="mt-1 text-sm text-[#57534E]">
                  {orderReceipt
                    ? `Kode pesanan ${orderReceipt.orderCode} berhasil dikirim.`
                    : "Isi nama dan email Anda untuk mengirim pesanan langsung."}
                </p>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setCheckoutOpen(false)}
                aria-label="Tutup dialog checkout"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#57534E] hover:bg-[#F3EFEA] hover:text-[#1C1917] disabled:opacity-40"
              >
                ×
              </button>
            </div>

            {orderReceipt ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-[#15803D]/25 bg-[#F0FDF4] p-4 text-sm text-[#14532D]">
                  <p className="font-semibold">Checkout berhasil!</p>
                  <p className="mt-1">
                    Detail pesanan atas nama{" "}
                    <span className="font-semibold">
                      {orderReceipt.customerName}
                    </span>{" "}
                    ({orderReceipt.customerEmail}) telah dikirim ke email Anda.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E7E2DA] bg-white p-4 text-sm space-y-2">
                  <div className="flex justify-between gap-2">
                    <span className="text-[#57534E]">Kode Pesanan</span>
                    <span className="font-semibold text-[#1C1917] tabular-nums">
                      {orderReceipt.orderCode}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#57534E]">Pemesan</span>
                    <span className="font-semibold text-[#1C1917]">
                      {orderReceipt.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#57534E]">Email</span>
                    <span className="font-medium text-[#1C1917]">
                      {orderReceipt.customerEmail}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#57534E]">
                      Total ({orderReceipt.totalItems} item)
                    </span>
                    <span className="font-bold text-[#1C1917] tabular-nums">
                      {formatRupiah(orderReceipt.totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleCopyOrder}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-[#E7E2DA] bg-white px-4 py-2.5 text-sm font-semibold text-[#1C1917] transition-colors hover:bg-[#F3EFEA]"
                  >
                    {copied ? "Detail Tersalin" : "Salin Detail Pesanan"}
                  </button>
                  <Link
                    to="/menu"
                    onClick={() => setCheckoutOpen(false)}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#C2410C] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9A3412]"
                  >
                    Kembali ke Menu
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="mb-1.5 block text-sm font-semibold text-[#1C1917]"
                  >
                    Nama lengkap
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-xl border border-[#E7E2DA] bg-white px-3.5 text-sm text-[#1C1917] placeholder:text-[#78716C] focus:border-[#C2410C] focus:outline-none disabled:opacity-60"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-email"
                    className="mb-1.5 block text-sm font-semibold text-[#1C1917]"
                  >
                    Email Anda
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@anda.com"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-xl border border-[#E7E2DA] bg-white px-3.5 text-sm text-[#1C1917] placeholder:text-[#78716C] focus:border-[#C2410C] focus:outline-none disabled:opacity-60"
                    required
                  />
                </div>

                <div className="rounded-xl border border-[#E7E2DA] bg-white p-3.5 text-sm flex items-center justify-between">
                  <span className="text-[#57534E]">
                    Total ({totalItems} item)
                  </span>
                  <span className="font-bold text-[#1C1917] tabular-nums">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>

                {formError && (
                  <p role="alert" className="text-sm font-medium text-red-700">
                    {formError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setCheckoutOpen(false)}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#E7E2DA] bg-white px-4 py-2 text-sm font-semibold text-[#1C1917] hover:bg-[#F3EFEA] disabled:opacity-40"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#C2410C] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#9A3412] disabled:opacity-60"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Pesanan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
