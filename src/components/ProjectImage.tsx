import Image from "next/image";

/**
 * Optimized project image. Uses next/image for automatic WebP/AVIF, sizing
 * and lazy loading — the raw PNG gallery files are large (up to 650KB).
 */
export default function ProjectImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1440}
      height={900}
      sizes="(max-width: 820px) 100vw, 33vw"
      className={className}
      loading="lazy"
    />
  );
}
