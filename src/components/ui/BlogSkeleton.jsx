export default function BlogSkeleton() {
  return (
    <div
      className="
        bg-background rounded-r24 p-s24
        flex justify-between gap-s8
        animate-pulse
      "
    >
      <div className="space-y-s12 w-full max-w-[60vw]">
        <div className="h-4 w-full bg-secondary-main rounded" />
        <div className="h-4 w-[95%] bg-secondary-main rounded" />
        <div className="h-4 w-[80%] bg-secondary-main rounded" />
        <div className="h-3 w-[120px] bg-secondary-main rounded mt-s16" />
      </div>

      <div className="w-8 h-8 rounded-full bg-secondary-main shrink-0" />
    </div>
  );
}
