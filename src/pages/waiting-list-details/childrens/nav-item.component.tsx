import React from 'react'

interface NavItemComponentProperties {
  icon: React.ReactNode
  isActive?: boolean
  label: string
}

export const NavItemComponent: React.FC<NavItemComponentProperties> = ({
  icon,
  isActive = false,
  label,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center gap-[3px] py-1.5 px-1">
      {isActive ? (
        <div className="bg-gold-bg rounded-[10px] w-10 h-7 flex items-center justify-center">
          <span className="text-gold">{icon}</span>
        </div>
      ) : (
        <span className="text-white/25">{icon}</span>
      )}
      <span className={`text-[9px] ${isActive ? 'text-gold font-medium' : 'text-white/25'}`}>
        {label}
      </span>
    </div>
  )
}
