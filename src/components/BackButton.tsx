import { ArrowLeft } from 'lucide-react'

export interface BackButtonProps {
  label?: string
  onClick?: () => void
}

export const BackButton: React.FC<BackButtonProps> = ({ label = 'Salons', onClick }) => {
  return (
    <button className="flex items-center gap-2 group cursor-pointer" onClick={onClick}>
      <div className="w-[30px] h-[30px] rounded-full bg-dark-card border border-white/[0.08] flex items-center justify-center transition-colors group-hover:bg-dark-secondary">
        <ArrowLeft className="w-[14px] h-[14px] text-white/70" />
      </div>
      {label && <span className="text-xs text-white/35 uppercase">{label}</span>}
    </button>
  )
}
