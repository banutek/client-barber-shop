export interface StatCardProps {
  label: string
  unit?: string
  value: number | string
}

export const StatCard: React.FC<StatCardProps> = ({ label, unit, value }) => {
  return (
    <div className="bg-dark-card rounded-[10px] py-2.5 px-2 text-center">
      <p className="text-xl font-medium text-gold m-0 leading-none">
        {value}
        {unit && <span className="text-[11px]">{unit}</span>}
      </p>
      <p className="text-[10px] text-white/30 mt-1.5 m-0">{label}</p>
    </div>
  )
}
