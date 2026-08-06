import { useCallback, useState } from 'react'
import { useCreateNewDeviceHook } from '../../hooks'

const SLIDES = [
  {
    buttonLabel: 'Suivant',
    image: '/onboarding-slide-1.jpg',
    title: 'Trouvez facilement des coiffeurs\net salons près de chez vous',
  },
  {
    buttonLabel: 'Suivant',
    image: '/onboarding-slide-2.jpg',
    title: "Réservez votre place en file d'attente\nen quelques secondes",
  },
  {
    buttonLabel: 'Je me lance',
    image: '/onboarding-slide-3.jpg',
    title: "Recevez une notification\nquand c'est votre tour",
  },
] as const

export interface OnboardingSlidesProps {
  onFinish: () => void
}

export function OnboardingSlides({ onFinish }: OnboardingSlidesProps) {
  const [current, setCurrent] = useState(0)
  const { mutate: doCreateNewDevice, isPending } = useCreateNewDeviceHook()

  const slide = SLIDES[current]
  const isLast = current === SLIDES.length - 1

  const handleNext = useCallback(() => {
    if (current < SLIDES.length - 1) {
      setCurrent((c) => c + 1)
    }
  }, [current])

  const handleFinish = useCallback(() => {
    doCreateNewDevice(
      { platform: 'web' },
      {
        onError: (err) => {
          console.error("Échec de la création de l'appareil", err)
        },
        onSuccess: () => {
          onFinish()
        },
      },
    )
  }, [doCreateNewDevice, onFinish])

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-black">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{ backgroundImage: `url(${slide.image})` }}
      />

      {/* Overlay dégradé pour lisibilité */}
      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/70" />

      {/* Zone de contenu en bas */}
      <div className="relative z-10 mt-auto flex flex-col items-center px-6 pb-10">
        {/* Titre */}
        <h2 className="text-2xl font-bold text-white text-center leading-snug whitespace-pre-line">
          {slide.title}
        </h2>

        {/* Indicateurs de navigation (dots) */}
        <div className="mt-6 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              aria-label={`Aller à l'étape ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-[#f97316]' : 'w-2 bg-white/40'
              }`}
              key={i}
              onClick={() => setCurrent(i)}
              type="button"
            />
          ))}
        </div>

        {/* Bouton */}
        <button
          className="mt-6 w-full rounded-xl bg-[#f97316] py-4 text-lg font-semibold text-white shadow-lg transition-all active:scale-[0.97] disabled:opacity-60"
          disabled={isPending}
          onClick={isLast ? handleFinish : handleNext}
          type="button"
        >
          {isPending ? 'Création en cours...' : slide.buttonLabel}
        </button>
      </div>
    </div>
  )
}
