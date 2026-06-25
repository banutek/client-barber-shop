import { Search } from 'lucide-react'
import type { ChangeEvent } from 'react'

export interface SearchBarProps {
  onChange?: (value: string) => void
  placeholder?: string
  value?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onChange,
  placeholder = 'Rechercher un salon...',
  value = '',
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <div className="mx-4 mb-3.5 flex items-center gap-2 bg-dark-card border border-white/8 rounded-xl py-2 px-3.5 transition-colors">
      <Search className="w-3.75 h-3.75 text-white/30 shrink-0" />
      <input
        className="bg-transparent text-[13px] text-white placeholder:text-white/25 outline-none w-full"
        onChange={handleChange}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </div>
  )
}
