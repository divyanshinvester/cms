
import Image from "next/image";

const AnimatedIcon = ({ isOpen,onClick}) => {
  
  return (
    <div
    onClick={onClick}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
     className="relative flex z-700 items-center gap-1 w-12 h-6 py-s24">
      {/* LEFT candle */}
      <Image
        src={"/Images/candel1.png"}
        color=""
        alt="Candle Icon"
        width={32}
        height={32}
        className={`
          w-2 h-6
          transition-all duration-500 ease-in-out
          ${isOpen
            ? "translate-y-2 scale-105 "
            : "translate-y-0 scale-100 "}
        `}
      />

      {/* RIGHT candle */}
      <Image
                src={"/Images/candel1.png"}

        alt="Candle Icon"
        width={32}
        height={32}
        className={`
          w-2 h-6
          transition-all duration-500 ease-in-out
          ${isOpen
            ? "-translate-y-2 scale-105 "
            : "translate-y-0 scale-100"}
        `}
      />
    </div>
  );
};

export default AnimatedIcon;
