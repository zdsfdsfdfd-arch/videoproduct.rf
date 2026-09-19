import type { CSSProperties } from 'react';
import type { Photo } from '@/assets';

interface Props {
  photo: Photo;
  alt: string;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

/** Responsive photo: the phone variant is picked automatically below ~720px of rendered width. */
export function Picture({ photo, alt, className, style, sizes = '100vw', loading = 'lazy', fetchPriority }: Props) {
  return (
    <img
      src={photo.src}
      srcSet={`${photo.small} 720w, ${photo.src} ${photo.width}w`}
      sizes={sizes}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
    />
  );
}
