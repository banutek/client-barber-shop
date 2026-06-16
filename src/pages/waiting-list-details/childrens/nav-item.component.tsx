import React from 'react'

interface NavItemComponentProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
}

export const NavItemComponent: React.FC<NavItemComponentProps> = ({ icon, label, isActive = false }) => {
  return (
    <div className="flex-1 flex flex-col items-center gap-[3px] py-1.5 px-1">
      {isActive ? (
        <div className="bg-gold-bg rounded-[10px] w-10 h-7 flex items-center justify-center">
          <span className="text-gold">{icon}</span>
        </div>
      ) : (
        <span className="text-white/25">{icon}</span>
      )}
      <span
        className={`text-[9px] ${isActive ? 'text-gold font-medium' : 'text-white/25'}`}
      >
        {label}
      </span>
    </div>
  )
}