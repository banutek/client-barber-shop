import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, SalonCardWithStats, SearchBar, SectionLabel } from '@/components'
import { useGetActiveShopsHook } from '@/hooks/shop'
import type { IBarberShopDtoOut } from '@/dto'

export interface IHomePageProps {
  default_method?: () => void
  default_props?: boolean
}

const matchesSearch = (shop: IBarberShopDtoOut, query: string): boolean => {
  const q = query.toLowerCase().trim()
  if (!q) return true
  return shop.name.toLowerCase().includes(q) || shop.address.toLowerCase().includes(q)
}

export const HomePage: React.FC<IHomePageProps> = () => {
  const stored: null | string = localStorage.getItem('device_infos')
  const { data } = useGetActiveShopsHook(stored ?? '')
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const shops = data?.data.shops ?? []

  const filteredShops = useMemo(
    () => shops.filter((shop) => matchesSearch(shop, searchQuery)),
    [shops, searchQuery],
  )

  const handleShopSelect = (salon: IBarberShopDtoOut) => {
    console.log('Selected salon:', salon)
    navigate(`/shop-details/${salon.id}`)
  }

  return (
    <div className="min-h-screen w-full bg-dark-bg lg:h-screen lg:min-h-0">
      {/* Mobile-first container with max-width for large screens */}
      <div className="mx-auto w-full max-w-md lg:max-w-lg xl:max-w-xl lg:h-full">
        {/* Phone frame simulation - hidden on small screens, visible on large screens */}
        <div className="lg:h-full lg:rounded-[36px] lg:border-8 lg:border-dark-secondary lg:shadow-2xl lg:overflow-hidden">
          {/* Inner content with proper mobile styling */}
          <div className="bg-dark-bg min-h-screen lg:min-h-0 lg:h-full lg:rounded-[28px] overflow-hidden flex flex-col">
            <main className="py-6 flex-1 overflow-y-auto">
              <Header highlightWord="salon" title="Choisissez votre salon" />

              <SearchBar
                onChange={setSearchQuery}
                placeholder="Rechercher un salon..."
                value={searchQuery}
              />

              <SectionLabel label="Près de vous" />

              <div className="flex flex-col gap-2 px-4 pb-4">
                {filteredShops.length > 0 ? (
                  filteredShops.map((salon) => (
                    <SalonCardWithStats
                      highlighted={false}
                      key={salon.id}
                      onClick={() => handleShopSelect(salon)}
                      shop={salon}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                      <svg
                        className="w-7 h-7 text-white/25"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <p className="text-white/60 text-sm font-medium mb-1">
                      {searchQuery.trim()
                        ? 'Aucun salon ne correspond à votre recherche'
                        : 'Aucun salon disponible'}
                    </p>
                    <p className="text-white/25 text-xs leading-relaxed max-w-[240px]">
                      {searchQuery.trim()
                        ? 'Essayez un autre nom ou une autre adresse.'
                        : 'Revenez plus tard, de nouveaux salons seront bientôt disponibles près de chez vous.'}
                    </p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
