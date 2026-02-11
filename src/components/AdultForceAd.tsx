interface AdultForceAdProps {
  src: string;
  width: number;
  height: number;
  title?: string;
  /** Scale to container width on small screens (for pre-roll, 950) */
  responsive?: boolean;
  className?: string;
}

export default function AdultForceAd({
  src,
  width,
  height,
  title = "Advertisement",
  responsive = false,
  className = "",
}: AdultForceAdProps) {
  if (!src) return null;

  return (
    <div
      className={`overflow-hidden rounded-lg bg-black/20 ${responsive ? "relative block w-full" : ""} ${className}`}
      style={
        responsive
          ? { aspectRatio: `${width} / ${height}`, maxWidth: width, margin: "0 auto" }
          : undefined
      }
    >
      <iframe
        title={title}
        src={src}
        width={responsive ? undefined : width}
        height={responsive ? undefined : height}
        scrolling="no"
        frameBorder={0}
        allowTransparency
        className={
          responsive ? "absolute inset-0 h-full w-full" : ""
        }
        style={responsive ? { border: 0 } : undefined}
      />
    </div>
  );
}
