import React from 'react'

export interface IShopGalleryComponentProps {
  default_method?: () => void
  default_props?: boolean
}

const PLACEHOLDER_IDS = [
  101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
  120,
]

const GALLERY_IMAGES = PLACEHOLDER_IDS.map((id) => ({
  id,
  src: `https://loremflickr.com/400/400/hair,hairstyle,haircut?random=${id}`,
  alt: `Galerie coiffure ${id}`,
}))

export const ShopGalleryComponent: React.FC<IShopGalleryComponentProps> = () => {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {GALLERY_IMAGES.map(({ id, src, alt }) => (
        <div
          key={id}
          className="relative aspect-square rounded-xl overflow-hidden bg-dark-secondary border border-white/5"
        >
          <img
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            src={src}
          />
        </div>
      ))}
    </div>
  )
}
