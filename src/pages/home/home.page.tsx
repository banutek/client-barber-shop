import { useEffect, useMemo, useState } from 'react'
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

  useEffect(() => {
    console.log('data:::::::', data)
  }, [data])

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
                {filteredShops.map((salon) => (
                  <SalonCardWithStats
                    distance={'320 m'}
                    highlighted={false}
                    key={salon.id}
                    onClick={() => handleShopSelect(salon)}
                    shop={salon}
                  />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
