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
import { useCreateNewListNumberHook, useGetListNumberByListIdHook } from '@/hooks/waiting-list-number'
import { WaitingListNumberStatus, type IBarberShopDtoOut, type INewWaitingListNumberDtoIn, type IWaitingListDtoOut } from '@/dto'
import { useDeviceStore, useShopStore, useWaitingListNumberStore } from '@/stores'

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
  const { currentDevice } = useDeviceStore()
  const { currentShop, setCurrentShop } = useShopStore()
  const {  setCurrentWaitingListNumber } = useWaitingListNumberStore()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentWaitingList, setCurrentWaitingList] = useState<IWaitingListDtoOut | null>(null)
  
  const { data } = useGetShopByIDHook(shopId)
  const { data: listNumberDatas } = useGetListNumberByListIdHook(currentWaitingList?.id)
  const { mutate: doCreateNewListNumber } = useCreateNewListNumberHook() 
  const deviceListNumber = listNumberDatas?.data.waitingListNumbers.find((_) => _.deviceId === currentDevice?.id)

  useEffect(() => {
    if (data?.data.shop) {
      setCurrentShop(data.data.shop)
    }
  },[data])

  useEffect(() => {
    console.log("listNumberDatas::::",listNumberDatas?.data.waitingListNumbers)
    if(listNumberDatas){
      setCurrentWaitingListNumber(listNumberDatas?.data.waitingListNumbers)
    }
  },[listNumberDatas])

  useEffect(() => {
    if(currentShop){
      const listDay = currentShop.barber_shop_waiting_list.find((_) => new Date(_.createdAt).getDay() === new Date().getDay())
      if(listDay){
        setIsOpen(true)
        setCurrentWaitingList(listDay)
      }
    }
  },[currentShop])

  const handleTakeTicket = () => {
    console.log(`Taking ticket for salon ${shopId}`)
    if(deviceListNumber){
      navigate(`/waiting-list-details/${deviceListNumber.waitingListId}`, {state:{deviceListNumber: deviceListNumber}})
      return
    }
    const currentList = currentShop.barber_shop_waiting_list.find((_) => new Date(_.createdAt).getDay() === new Date().getDay())
    if(currentList){
      const requestBody: INewWaitingListNumberDtoIn = {
        waitingListId: currentList.id,
        deviceId: currentDevice?.id
      }
      doCreateNewListNumber(requestBody, {
        onSuccess: (response) => {
          console.log('Ticket taken successfully:', response.data)
          if(response.data && currentWaitingList){
            navigate(`/waiting-list-details/${currentWaitingList.id}`, {state:{deviceListNumber: response?.data?.waitingListNumber}})
            // navigate(`/waiting-list-details/${currentWaitingList.id}`)
          }
        },
        onError: (error) => {
          console.error('Failed to take ticket:', error)
        }
      })
    }
  }

  console.log({currentWaitingList})

  const waitingCount = listNumberDatas?.data.waitingListNumbers.filter((_) => _.status === WaitingListNumberStatus.CREATED)

  console.log({deviceListNumber})

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
                  <StatCard value={waitingCount?.length} label="En attente" />
                  <StatCard
                    value={salonData.avgWaitTime}
                    unit="min"
                    label="Attente moy."
                  />
                  <StatCard
                    value={String(currentWaitingList?.current_number).padStart(2, '0')}
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
                {listNumberDatas?.data.waitingListNumbers.map((item, index) => (
                  <QueueItem
                    key={index}
                    ticketNumber={item.value}
                    status={item.status}
                    isLast={index === salonData.queue.length - 1}
                  />
                ))}
              </div>

              {/* CTA Button */}
              <div className="px-3 pb-4">
                <button
                  onClick={handleTakeTicket}
                  disabled={!isOpen}
                  className="w-full py-3.5 rounded-[14px] border-none bg-gold text-dark-bg text-sm font-medium cursor-pointer flex items-center justify-center gap-2 hover:bg-gold/90 transition-colors disabled:bg-dark-card disabled:text-white/30 disabled:cursor-not-allowed disabled:hover:bg-dark-card"
                >
                  <Ticket className="w-4 h-4" />
                  {!isOpen ? "Pas encore disponible" : deviceListNumber ? "Voir détails file" : "Tirer mon numéro"}
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
