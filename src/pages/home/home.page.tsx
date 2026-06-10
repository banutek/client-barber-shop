import { StatusBar, Header, SearchBar, SectionLabel, SalonCard } from '@/components'
import type { IBarberShopDtoOut } from '@/dto'
import { useGetActiveShopsHook } from '@/hooks/shop'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export interface IHomePageProps {
  default_props?: boolean
  default_method?: () => void
}

const salons = [
  {
    id: 1,
    name: 'Salon Baraka',
    location: 'Maarif, Casablanca',
    distance: '320 m',
    waitCount: 4,
    waitTime: '~18 min',
    status: 'open' as const,
    highlighted: true,
  },
  {
    id: 2,
    name: 'Barbershop Atlas',
    location: 'Gauthier, Casablanca',
    distance: '1.2 km',
    waitCount: 9,
    waitTime: '~35 min',
    status: 'busy' as const,
    highlighted: false,
  },
  {
    id: 3,
    name: 'Coiff & Style',
    location: 'Hay Hassani, Casablanca',
    distance: '2.1 km',
    waitCount: 2,
    waitTime: '~8 min',
    status: 'open' as const,
    highlighted: false,
  },
]

export const HomePage: React.FC<IHomePageProps> = () => {
  const stored: string | null = localStorage.getItem('device_infos')
  console.log({stored})
  const { data } = useGetActiveShopsHook(stored)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('data:::::::', data)
  },[data])

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
              <Header
                title="Choisissez votre salon"
                highlightWord="salon"
              />

              <SearchBar placeholder="Rechercher un salon..." />

              <SectionLabel label="Près de vous" />

              <div className="flex flex-col gap-2 px-4 pb-4">
                {data?.data.shops.map((salon) => (
                  <SalonCard
                    key={salon.id}
                    name={salon.name}
                    location={salon.address}
                    distance={'320 m'}
                    waitCount={0}
                    waitTime={'0 min'}
                    status={salon.openStatus}
                    highlighted={false}
                    onClick={() => handleShopSelect(salon)}
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
