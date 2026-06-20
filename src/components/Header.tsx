export interface HeaderProps {
  greeting?: string
  highlightWord?: string
  title: string
}

export const Header: React.FC<HeaderProps> = ({ greeting = 'Bonjour', highlightWord, title }) => {
  const renderTitle = () => {
    if (!highlightWord) return title

    const parts = title.split(highlightWord)
    if (parts.length === 1) return title

    return (
      <>
        {parts[0]}
        <span className="text-gold">{highlightWord}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <div className="px-4 pb-3">
      <p className="text-xs text-white/40 mb-0.5">{greeting}</p>
      <h2 className="text-[22px] font-medium text-text-primary leading-tight m-0">
        {renderTitle()}
      </h2>
    </div>
  )
}
