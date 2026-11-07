import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const sortedImages = useMemo(
    () =>
      [...images].sort((first, second) => (first.displayOrder ?? 0) - (second.displayOrder ?? 0)),
    [images],
  )

  const showPreviousImage = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null || sortedImages.length === 0) return currentIndex
      return (currentIndex - 1 + sortedImages.length) % sortedImages.length
    })
  }, [sortedImages.length])

  const showNextImage = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null || sortedImages.length === 0) return currentIndex
      return (currentIndex + 1) % sortedImages.length
    })
  }, [sortedImages.length])

  useEffect(() => {
    setSelectedIndex(null)
  }, [shopId])

  useEffect(() => {
    if (selectedIndex !== null && selectedIndex >= sortedImages.length) {
      setSelectedIndex(null)
    }
  }, [selectedIndex, sortedImages.length])

  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedIndex(null)
      if (event.key === 'ArrowLeft') showPreviousImage()
      if (event.key === 'ArrowRight') showNextImage()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, showNextImage, showPreviousImage])

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
    <>
      <div className="grid grid-cols-3 gap-1.5">
        {sortedImages.map((image, index) => (
          <button
            key={image.id}
            aria-label={`Ouvrir l'image ${image.alt || index + 1}`}
            className="relative aspect-square rounded-xl overflow-hidden bg-dark-secondary border border-white/5 p-0"
            onClick={() => setSelectedIndex(index)}
            type="button"
          >
            <img
              alt={image.alt || 'Galerie du salon'}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              src={resolveImageUrl(image.url)}
            />
          </button>
        ))}
      </div>

      {selectedIndex !== null && sortedImages[selectedIndex] && (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          role="dialog"
          onClick={() => setSelectedIndex(null)}
          onTouchEnd={(event) => {
            if (touchStartX === null) return
            const distance = event.changedTouches[0].clientX - touchStartX
            if (Math.abs(distance) > 50) {
              if (distance > 0) showPreviousImage()
              else showNextImage()
            }
            setTouchStartX(null)
          }}
          onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
        >
          <button
            aria-label="Fermer la galerie"
            className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white"
            onClick={() => setSelectedIndex(null)}
            type="button"
          >
            <X className="h-6 w-6" />
          </button>

          {sortedImages.length > 1 && (
            <>
              <button
                aria-label="Image précédente"
                className="absolute left-3 z-10 rounded-full bg-black/60 p-2 text-white"
                onClick={(event) => {
                  event.stopPropagation()
                  showPreviousImage()
                }}
                type="button"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                aria-label="Image suivante"
                className="absolute right-3 z-10 rounded-full bg-black/60 p-2 text-white"
                onClick={(event) => {
                  event.stopPropagation()
                  showNextImage()
                }}
                type="button"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}

          <img
            alt={sortedImages[selectedIndex].alt || 'Galerie du salon'}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(event) => event.stopPropagation()}
            src={resolveImageUrl(sortedImages[selectedIndex].url)}
          />
          <span className="absolute bottom-4 text-sm text-white/80">
            {selectedIndex + 1} / {sortedImages.length}
          </span>
        </div>
      )}
    </>
  )
}
