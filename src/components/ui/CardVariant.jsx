import Button from "./Button";

export default function JourneyLogCardUI({ log }) {
  const thumbnail =
    log.thumbnailType === "open"
      ? log.thumbnailOpen
      : log.thumbnailClose;

  return (
    <div
      className="
        bg-background
        rounded-r24
        p-s24 md:p-s32
        flex flex-col md:flex-row
        gap-s24 lg:gap-s32
      "
    >
      {/* Image */}
      <img
        src={thumbnail}
        alt="Journey log"
        className="
          w-full
          md:w-[465px]
          h-[220px] sm:h-[280px] lg:h-[350px]
          rounded-r16
          object-cover
          shrink-0
        "
      />

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 gap-s16">
        <div className="max-w-[30vw] md:max-w-[30vw] flex flex-col ">
              <p className="body-default flex-1 line-clamp-3 break-words">{log.description}</p>
            
</div>
        <div className="flex items-center justify-between gap-s16">
          <p className="caption text-secondary">
            {new Date(log.createdAt).toLocaleDateString()}
          </p>

          <Button size="sm">View more</Button>
        </div>
      </div>
    </div>
  );
}
