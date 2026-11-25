import { useEffect } from "react";

const PlusOnePopup = ({ visible, onDone, text = "+1", duration = 650 }) => {
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      onDone?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, onDone]);

  if (!visible) return null;

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-3 right-2 z-20 rounded-full bg-[#15803D] px-2.5 py-0.5 text-xs font-bold text-white shadow-sm km-hero-enter"
    >
      {text}
    </span>
  );
};

export default PlusOnePopup;
