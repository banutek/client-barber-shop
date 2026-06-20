import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, SalonCardWithStats, SearchBar, SectionLabel, StatusBar } from '@/components'
import { useGetActiveShopsHook } from '@/hooks/shop'
import type { IBarberShopDtoOut } from '@/dto'

export interface IHomePageProps {
  default_method?: () => void
  default_props?: boolean
}

export const HomePage: React.FC<IHomePageProps> = () => {
  const stored: null | string = localStorage.getItem('device_infos')
  console.log({ stored })
  const { data } = useGetActiveShopsHook(stored ?? '')
  const navigate = useNavigate()

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
            <StatusBar />

            <main className="pb-6 flex-1 overflow-y-auto">
              <Header highlightWord="salon" title="Choisissez votre salon" />

              <SearchBar placeholder="Rechercher un salon..." />

              <SectionLabel label="Près de vous" />

              <div className="flex flex-col gap-2 px-4 pb-4">
                {data?.data.shops.map((salon) => (
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
