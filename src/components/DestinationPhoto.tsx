import type { CSSProperties } from 'react'
import type { TripPhoto } from '../data/images'

type DestinationPhotoProps = {
  photo: TripPhoto
  variant: 'hero' | 'day'
  eager?: boolean
}

export function DestinationPhoto({ photo, variant, eager = false }: DestinationPhotoProps) {
  const base = `${import.meta.env.BASE_URL}images/${photo.id}`
  const style = { '--photo-position': photo.position } as CSSProperties

  return (
    <figure className={`destination-photo destination-photo-${variant}`} style={style}>
      <picture>
        <source type="image/avif" srcSet={`${base}-960.avif 960w, ${base}-1600.avif 1600w`} sizes={variant === 'hero' ? '(max-width: 720px) 100vw, 56vw' : '(max-width: 1240px) 100vw, 1240px'} />
        <source type="image/webp" srcSet={`${base}-960.webp 960w, ${base}-1600.webp 1600w`} sizes={variant === 'hero' ? '(max-width: 720px) 100vw, 56vw' : '(max-width: 1240px) 100vw, 1240px'} />
        <img
          src={`${base}-1600.webp`}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          data-photo-id={photo.id}
        />
      </picture>
      <figcaption>
        <span>{photo.place}</span>
        <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">Photo: {photo.author} · {photo.license}</a>
      </figcaption>
    </figure>
  )
}
