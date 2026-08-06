export interface OnboardingWelcomeProps {
  onFinish: () => void
}

export function OnboardingWelcome({ onFinish }: OnboardingWelcomeProps) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-black">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/onboarding-welcome.jpg)',
        }}
      />

      {/* Overlay dégradé pour lisibilité du texte */}
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-black/70" />

      {/* Zone de texte */}
      <div className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-8">
        <h1 className="text-4xl font-bold text-white leading-tight">
          Bienvenue chez 👋
          <br />
          THE-HAIR
        </h1>
        <p className="mt-4 text-base text-white/80 leading-relaxed max-w-sm">
          La meilleure application de coiffure et de salon de ce siècle pour vous aider à être au
          mieux de votre forme.
        </p>
      </div>

      {/* Bouton "Débuter" */}
      <div className="relative z-10 px-6 pb-10">
        <button
          className="w-full rounded-xl bg-[#f97316] py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-[0.97]"
          onClick={onFinish}
          type="button"
        >
          Débuter
        </button>
      </div>
    </div>
  )
}
