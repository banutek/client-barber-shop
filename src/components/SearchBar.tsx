import { Search } from 'lucide-react'

export interface SearchBarProps {
  onClick?: () => void
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onClick,
  placeholder = 'Rechercher un salon...',
}) => {
  return (
    <div
      className="mx-4 mb-3.5 flex items-center gap-2 bg-dark-card border border-white/[0.08] rounded-xl py-2 px-3.5 cursor-pointer hover:bg-dark-card/80 transition-colors"
      onClick={onClick}
    >
      <Search className="w-[15px] h-[15px] text-white/30" />
      <span className="text-[13px] text-white/25">{placeholder}</span>
    </div>
  )
}
