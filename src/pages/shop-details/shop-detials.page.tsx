import { useNavigate, useParams } from 'react-router-dom'
import { Clock, Phone, Ticket } from 'lucide-react'
import {
  StatusBar,
  BackButton,
  SalonIdentity,
  StatCard,
  InfoRow,
  QueueItem,
} from '@/components'
import { useGetShopByIDHook } from '@/hooks/shop'
import { useEffect, useState } from 'react'
import { useCreateNewListNumberHook } from '@/hooks/waiting-list-number'
import type { IBarberShopDtoOut, INewWaitingListNumberDtoIn } from '@/dto'
import { useShopStore } from '@/stores'

export interface IShopDetailsPageProps {
  default_props?: boolean
  default_method?: () => void
}

// Mock data - would come from API in real app
const salonData = {
  id: 1,
  name: 'Salon Baraka',
  location: 'Maarif, Casablanca',
  distance: '320 m',
  waitingCount: 4,
  avgWaitTime: 18,
  currentNumber: 7,
  hours: '09:00 — 19:00',
  phone: '+212 6 00 11 22 33',
  queue: [
    { ticketNumber: 'N° 07', status: 'in-chair' as const },
    { ticketNumber: 'N° 08', status: 'next' as const },
    { ticketNumber: 'N° 09 — 10 — 11', status: 'waiting' as const },
  ],
}

export const ShopDetailsPage: React.FC<IShopDetailsPageProps> = () => {
  const navigate = useNavigate()
  const { shopId } = useParams<{ shopId: string }>()
  const { currentDevice } = useShopStore()
  const [currentShop, setCurrentShop] = useState<IBarberShopDtoOut | null>(null)
  
  const { data } = useGetShopByIDHook(shopId)
  const { mutate: doCreateNewListNumber } = useCreateNewListNumberHook()

  useEffect(() => {
    if (data?.data.shop) {
      setCurrentShop(data.data.shop)
    }
  },[data])

  const handleTakeTicket = () => {
    console.log(`Taking ticket for salon ${shopId}`)
    const currentList = currentShop.barber_shop_waiting_list.find((_) => _.createdAt.getDay() === new Date().getDay())
    if(currentList){
      const requestBody: INewWaitingListNumberDtoIn = {
        waitingListId: currentList.id,
        deviceId: currentDevice?.id
      }
      doCreateNewListNumber(requestBody, {
        onSuccess: (response) => {
          console.log('Ticket taken successfully:', response.data)
        },
        onError: (error) => {
          console.error('Failed to take ticket:', error)
        }
      })
    }
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

            <main className="flex-1 overflow-y-auto">
              {/* Hero Section */}
              <div className="bg-[#141418] rounded-[20px] p-4 mx-3 mt-0 mb-2.5 relative overflow-hidden">
                {/* Back Button */}
                <div className="mb-4">
                  <BackButton label="Salons" onClick={() => navigate('/')} />
                </div>

                {/* Salon Identity */}
                <SalonIdentity
                  name={currentShop?.name}
                  location={currentShop?.address}
                  distance={'322 m'}
                />

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-1.5">
                  <StatCard value={salonData.waitingCount} label="En attente" />
                  <StatCard
                    value={salonData.avgWaitTime}
                    unit="min"
                    label="Attente moy."
                  />
                  <StatCard
                    value={String(salonData.currentNumber).padStart(2, '0')}
                    label="N° courant"
                  />
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-dark-secondary border border-dark-border rounded-2xl py-3 px-3.5 mx-3 mb-2">
                <InfoRow
                  icon={Clock}
                  label="Horaires"
                  value={salonData.hours}
                />
                <InfoRow
                  icon={Phone}
                  label="Téléphone"
                  value={currentShop?.phone || currentShop?.manager?.phone}
                  isLast
                />
              </div>

              {/* Live Queue Section */}
              <div className="bg-dark-secondary border border-dark-border rounded-2xl py-3 px-3.5 mx-3 mb-3">
                <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2.5">
                  File en direct
                </p>
                {salonData.queue.map((item, index) => (
                  <QueueItem
                    key={index}
                    ticketNumber={item.ticketNumber}
                    status={item.status}
                    isLast={index === salonData.queue.length - 1}
                  />
                ))}
              </div>

              {/* CTA Button */}
              <div className="px-3 pb-4">
                <button
                  onClick={handleTakeTicket}
                  disabled={currentShop?.barber_shop_waiting_list === null}
                  className="w-full py-3.5 rounded-[14px] border-none bg-gold text-dark-bg text-sm font-medium cursor-pointer flex items-center justify-center gap-2 hover:bg-gold/90 transition-colors disabled:bg-dark-card disabled:text-white/30 disabled:cursor-not-allowed disabled:hover:bg-dark-card"
                >
                  <Ticket className="w-4 h-4" />
                  {currentShop?.barber_shop_waiting_list === null ? "Pas encore disponible" : "Tirer mon numéro"}
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
