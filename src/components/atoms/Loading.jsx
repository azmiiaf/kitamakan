const LoadingSpinner = ({ size = "md", label = "Memuat..." }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
      <div
        className={`
          ${sizes[size] || sizes.md}
          rounded-full
          border-solid
          border-[#E7E2DA]
          border-t-[#C2410C]
          animate-spin
        `}
        role="status"
        aria-label={label}
      />
      {label && <p className="text-sm text-[#57534E]">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
