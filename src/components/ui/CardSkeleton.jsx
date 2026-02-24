export default function JourneyLogSkeleton() {
  return (
    <div
      className="
        bg-background
        rounded-r24
        p-s24 md:p-s32
        flex flex-col lg:flex-row
        gap-s24
        animate-pulse
      "
    >
      {/* Image skeleton */}
      <div
        className="
          w-full
          lg:w-[465px]
          h-[220px] sm:h-[280px] lg:h-[350px]
          rounded-r16
          bg-secondary-main
        "
      />

      {/* Text skeleton */}
      <div className="flex flex-col justify-between flex-1 gap-s16">
        <div className="space-y-s12">
          <div className="h-4 bg-secondary-main rounded w-full" />
          <div className="h-4 bg-secondary-main rounded w-[90%]" />
          <div className="h-4 bg-secondary-main rounded w-[70%]" />
        </div>

        <div className="flex justify-between items-center">
          <div className="h-3 w-24 bg-secondary-main rounded" />
          <div className="h-8 w-28 bg-secondary-main rounded" />
        </div>
      </div>
    </div>
  );
}
