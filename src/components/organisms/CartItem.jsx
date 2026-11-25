import { formatRupiah } from "../../utils/formatters";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const quantity = item.quantity || 1;
  const subtotal = (Number(item.price) || 0) * quantity;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#E7E2DA] bg-white p-4 transition-colors hover:border-[#C2410C]/35">
      <div className="flex items-center gap-4 min-w-0">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E7E2DA] bg-[#F3EFEA]">
          <img
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>

        <div className="min-w-0">
          {item.category && (
            <span className="mb-1 inline-block rounded-md bg-[#FFF7ED] px-2 py-0.5 text-xs font-semibold text-[#9A3412]">
              {item.category}
            </span>
          )}
          <h3 className="truncate text-base font-semibold text-[#1C1917]">
            {item.name}
          </h3>
          <p className="mt-0.5 text-xs text-[#57534E] tabular-nums">
            {formatRupiah(item.price)} / porsi
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-[#F3EFEA] pt-3 sm:border-t-0 sm:pt-0">
        <div className="flex items-center rounded-xl border border-[#E7E2DA] bg-[#FAF8F5]">
          <button
            type="button"
            onClick={onDecrease}
            aria-label={`Kurangi jumlah ${item.name}`}
            className="flex h-11 w-11 items-center justify-center rounded-l-xl font-semibold text-[#1C1917] transition-colors hover:bg-[#F3EFEA]"
          >
            −
          </button>
          <span className="w-8 select-none text-center text-sm font-semibold text-[#1C1917] tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            aria-label={`Tambah jumlah ${item.name}`}
            className="flex h-11 w-11 items-center justify-center rounded-r-xl font-semibold text-[#1C1917] transition-colors hover:bg-[#F3EFEA]"
          >
            +
          </button>
        </div>

        <div className="min-w-[96px] text-right">
          <span className="block text-xs text-[#57534E]">Subtotal</span>
          <span className="text-sm sm:text-base font-bold text-[#1C1917] tabular-nums">
            {formatRupiah(subtotal)}
          </span>
        </div>

        <button
          type="button"
          onClick={onRemove}
          title="Hapus item"
          aria-label={`Hapus ${item.name}`}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-[#57534E] transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
