import { useCallback, useState } from "react";
import PlusOnePopup from "../atoms/PlusOnePopup";
import { formatRupiah } from "../../utils/formatters";

const FoodCard = ({ item, onAddToCart }) => {
  const [showPlusOne, setShowPlusOne] = useState(false);

  const handleOrderClick = () => {
    onAddToCart?.(item);
    setShowPlusOne(false);
    requestAnimationFrame(() => {
      setShowPlusOne(true);
    });
  };

  const handleHidePopup = useCallback(() => {
    setShowPlusOne(false);
  }, []);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E7E2DA] bg-white transition-colors duration-200 hover:border-[#C2410C]/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3EFEA]">
        <img
          src={item.image}
          alt={item.name}
          width={400}
          height={300}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {item.category && (
          <span className="absolute top-3 left-3 rounded-lg bg-[#FAF8F5]/95 px-2.5 py-1 text-xs font-semibold text-[#1C1917] border border-[#E7E2DA]">
            {item.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-snug text-[#1C1917] line-clamp-1">
            {item.name}
          </h3>
          {item.rating && (
            <span
              aria-label={`Rating ${item.rating}`}
              className="shrink-0 rounded-md bg-[#FFF7ED] px-2 py-0.5 text-xs font-semibold text-[#9A3412]"
            >
              ★ {item.rating}
            </span>
          )}
        </div>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-[#57534E] line-clamp-2">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#F3EFEA] pt-3.5">
          <div>
            <span className="block text-xs text-[#57534E]">Harga</span>
            <span className="text-base font-bold text-[#1C1917] tabular-nums">
              {formatRupiah(item.price)}
            </span>
          </div>

          <div className="relative">
            <PlusOnePopup
              visible={showPlusOne}
              onDone={handleHidePopup}
              duration={650}
            />
            <button
              type="button"
              onClick={handleOrderClick}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#C2410C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#9A3412] active:scale-[0.98]"
            >
              + Pesan
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FoodCard;
