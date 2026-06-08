export interface SectionLabelProps {
  label: string
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ label }) => {
  return (
    <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider px-4 mb-2">
      {label}
    </p>
  )
}
