import React, { useMemo } from 'react'
import type { IGalleryDtoOut } from '@/dto'
import { useGetGalleryByShopHook } from '@/hooks'
import { resolveImageUrl } from '@/utils/image'

export interface IShopGalleryComponentProps {
  default_method?: () => void
  default_props?: boolean
  shopId?: string
  accessToken?: string
}

export const ShopGalleryComponent: React.FC<IShopGalleryComponentProps> = ({ shopId }) => {
  const { data, isLoading, isError } = useGetGalleryByShopHook(shopId || '')
  const images = useMemo<IGalleryDtoOut[]>(() => data?.data.images ?? [], [data])

  const sortedImages = useMemo(
    () =>
      [...images].sort((first, second) => (first.displayOrder ?? 0) - (second.displayOrder ?? 0)),
    [images],
  )

  if (!shopId) {
    return (
      <p className="rounded-xl border border-dark-border bg-dark-card px-4 py-6 text-center text-xs text-white/50">
        Sélectionnez un salon pour voir sa galerie.
      </p>
    )
  }

  if (isLoading) {
    return (
      <div aria-label="Chargement de la galerie" className="grid grid-cols-3 gap-1.5 animate-pulse">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="aspect-square rounded-xl bg-dark-secondary" />
        ))}
      </div>
    )
  }

  if (isError) {
    console.error('[ShopGalleryComponent] Failed to load gallery.')
    return <p className="text-xs text-red-400">Impossible de charger la galerie.</p>
  }

  if (sortedImages.length === 0) {
    return (
      <p className="rounded-xl border border-dark-border bg-dark-card px-4 py-6 text-center text-xs text-white/50">
        Aucune image disponible pour ce salon.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {sortedImages.map((image) => (
        <div
          key={image.id}
          className="relative aspect-square rounded-xl overflow-hidden bg-dark-secondary border border-white/5"
        >
          <img
            alt={image.alt || 'Galerie du salon'}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            src={resolveImageUrl(image.url)}
          />
        </div>
      ))}
    </div>
  )
}
