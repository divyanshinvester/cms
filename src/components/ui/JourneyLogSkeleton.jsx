export default function JourneyLogSkeleton() {
  return (
    <div
      className="
        bg-background rounded-r24 p-s24
        flex 
        gap-s16 md:gap-s24
        animate-pulse
      "
    >
      {/* Image */}
      <div
        className="
          w-full md:w-[20vw] lg:max-w-[40vw]
          h-[100px] md:h-[160px]
          rounded-r16 bg-secondary-main
        "
      />

      {/* Content */}
      <div className="flex-1 space-y-s12">
        <div className="h-4 w-full bg-secondary-main rounded" />
        <div className="h-4 w-[90%] bg-secondary-main rounded" />
        <div className="h-4 w-[70%] bg-secondary-main rounded" />
        <div className="h-3 w-[120px] bg-secondary-main rounded mt-s16" />
      </div>

      {/* Menu */}
      <div className="w-8 h-8 rounded-full bg-secondary-main shrink-0" />
    </div>
  );
}
