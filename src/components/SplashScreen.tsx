import { useCallback, useEffect, useState } from 'react'

export interface SplashScreenProps {
  /** Durée d'affichage en ms (avant début du fade-out). Défaut: 1800ms */
  duration?: number
  /** Appelé après la fin de l'animation de sortie */
  onFinish?: () => void
}

export function SplashScreen({ duration = 1800, onFinish }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false)

  const handleFinish = useCallback(() => {
    onFinish?.()
  }, [onFinish])

  // Déclenche le fade-out après `duration` ms
  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), duration)
    return () => clearTimeout(timer)
  }, [duration])

  // Notifie le parent une fois l'animation de sortie terminée (400ms)
  useEffect(() => {
    if (!fadeOut) return
    const timer = setTimeout(handleFinish, 400)
    return () => clearTimeout(timer)
  }, [fadeOut, handleFinish])

  return (
    <div
      aria-label="Chargement"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-400 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      role="alert"
    >
      {/* Lettre "C" stylisée */}
      <span
        className="text-[120px] font-extrabold leading-none tracking-tighter select-none"
        style={{ color: '#d4a853', fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        THE-HAIR
      </span>

      {/* Spinner circulaire orange */}
      <div className="mt-10 h-8 w-8 rounded-full border-[3px] border-[#c9b58d] border-t-[#d89a1f] animate-spin" />
    </div>
  )
}
