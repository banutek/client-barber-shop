import React from 'react'


interface QueueAvatarComponentProps {
  number: string
  // status: 'active' | 'waiting' | 'current'
  status: string
  size?: 'sm' | 'md'
}

export const QueueAvatarComponent: React.FC<QueueAvatarComponentProps> = ({
  number,
  status,
  size = 'sm',
}) => {
  const dimensions = size === 'md' ? 'w-7 h-7' : 'w-[26px] h-[26px]'
  const fontSize = size === 'md' ? 'text-[9px] font-medium' : 'text-[9px]'

  if (status === 'active') {
    return (
      <div
        className={`${dimensions} rounded-full bg-success border-2 border-dark-bg flex items-center justify-center ${fontSize} text-dark-bg z-[6]`}
      >
        {number}
      </div>
    )
  }

  if (status === 'current') {
    return (
      <div
        className={`${dimensions} rounded-full bg-gold-bg border-2 border-gold flex items-center justify-center ${fontSize} text-gold z-[1]`}
      >
        {number}
      </div>
    )
  }

  return (
    <div
      className={`${dimensions} rounded-full bg-dark-card border-2 border-dark-bg flex items-center justify-center ${fontSize} text-white/40 -ml-1`}
    >
      {number}
    </div>
  )
}