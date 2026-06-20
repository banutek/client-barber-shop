import { BatteryMedium, Wifi } from 'lucide-react'

export const StatusBar: React.FC = () => {
  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="flex justify-between items-center px-3 py-1 pb-2.5">
      <span className="text-[13px] font-bold text-white/90">{currentTime}</span>
      <div className="flex gap-1.5 items-center">
        <Wifi className="w-[13px] h-[13px] text-white/50" />
        <BatteryMedium className="w-[13px] h-[13px] text-white/50" />
      </div>
    </div>
  )
}
