import Image from "next/image";

/**
 * Optimized project image. Uses next/image for automatic WebP/AVIF, sizing
 * and lazy loading. The Echo Travel source PNG alone is roughly 1.43 MB,
 * while Next's optimized 1080px WebP response is around 12 KB.
 */
export default function ProjectImage({
  src,
  alt,
  className,
  sizes = "(max-width: 680px) calc(100vw - 40px), (max-width: 1056px) 50vw, 33vw",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1440}
      height={900}
      sizes={sizes}
      className={className}
      loading="lazy"
    />
  );
}
