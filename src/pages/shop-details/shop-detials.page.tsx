import { Clock, Phone, Ticket } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton, InfoRow, QueueItem, SalonIdentity, StatCard, StatusBar } from '@/components'
import { type INewWaitingListNumberDtoIn, ShopOpenStatus, WaitingListNumberStatus } from '@/dto'
import { useGetShopByIDHook } from '@/hooks/shop'
import { useDailyStatsHook } from '@/hooks/stats'
import {
  useCreateNewListNumberHook,
  useGetListNumberByListIdHook,
} from '@/hooks/waiting-list-number'
import {
  useDeviceStore,
  useShopStore,
  useWaitingListNumberStore,
  useWaitingListStore,
} from '@/stores'

export interface IShopDetailsPageProps {
  default_method?: () => void
  default_props?: boolean
}

// Default hours — would come from shop config in a future backend update
const DEFAULT_HOURS = '09:00 — 19:00'

export const ShopDetailsPage: React.FC<IShopDetailsPageProps> = () => {
  const navigate = useNavigate()
  const { shopId } = useParams<{ shopId: string }>()
  const { currentDevice } = useDeviceStore()
  const { currentShop, setCurrentShop } = useShopStore()
  const { setCurrentWaitingListNumber } = useWaitingListNumberStore()
  const { currentWaitingList, setCurrentWaitingList } = useWaitingListStore()

  const { data } = useGetShopByIDHook(shopId as string)
  const { data: listNumberDatas } = useGetListNumberByListIdHook(currentWaitingList?.id as string)
  const { data: statsData } = useDailyStatsHook(shopId as string)
  const { mutate: doCreateNewListNumber } = useCreateNewListNumberHook()
  const deviceListNumber = listNumberDatas?.data.waitingListNumbers.find(
    (_) => _.deviceId === currentDevice?.id,
  )

  const isOpen = currentShop?.openStatus === ShopOpenStatus.OPEN

  useEffect(() => {
    if (!data?.data.shop) {
      return
    }

    setCurrentShop(data.data.shop)
  }, [data, setCurrentShop])

  console.log({ currentShop })

  useEffect(() => {
    if (listNumberDatas) {
      setCurrentWaitingListNumber(listNumberDatas?.data.waitingListNumbers)
    }
  }, [listNumberDatas])

  useEffect(() => {
    if (!currentShop) {
      return
    }

    const listDay = currentShop.barber_shop_waiting_list.find(
      (_) => new Date(_.createdAt).getDay() === new Date().getDay(),
    )
    if (listDay) {
      setCurrentWaitingList(listDay)
    }
  }, [currentShop])

  const handleTakeTicket = () => {
    if (deviceListNumber) {
      navigate(`/waiting-list-details/${deviceListNumber.waitingListId}`, {
        state: {
          currentList: currentWaitingList,
          deviceListNumber,
          shop: currentShop,
        },
      })
      return
    }
    const currentList = currentShop?.barber_shop_waiting_list?.find(
      (_) => new Date(_.createdAt).getDay() === new Date().getDay(),
    )
    console.log({ currentShop })
    console.log({ currentList })
    if (currentList) {
      const requestBody: INewWaitingListNumberDtoIn = {
        deviceId: currentDevice?.id as string,
        waitingListId: currentList.id,
      }
      doCreateNewListNumber(requestBody, {
        onError: (error) => {
          console.error('Failed to take ticket:', error)
        },
        onSuccess: (response) => {
          console.log('Ticket taken successfully:', response.data)
          if (response.data && currentWaitingList) {
            navigate(`/waiting-list-details/${currentWaitingList.id}`, {
              state: {
                currentList: currentWaitingList,
                deviceListNumber: response?.data?.waitingListNumber,
                shop: currentShop,
              },
            })
            // navigate(`/waiting-list-details/${currentWaitingList.id}`)
          }
        },
      })
    }
  }

  const waitingCount = listNumberDatas?.data.waitingListNumbers.filter(
    (_) => _.status === WaitingListNumberStatus.CREATED,
  )

  // Group consecutive CREATED status numbers
  const groupedQueue = listNumberDatas?.data.waitingListNumbers.reduce(
    (accumulator: any[], item) => {
      if (item.status === WaitingListNumberStatus.CREATED) {
        // Check if previous item was also CREATED
        const previousItem = accumulator.length > 0 ? accumulator.at(-1) : null
        if (
          previousItem &&
          previousItem.status === WaitingListNumberStatus.CREATED &&
          previousItem.isGrouped
        ) {
          // Add to existing group
          previousItem.ticketNumber += ` — ${item.value}`
          return accumulator
        }
        // Start new group
        return [...accumulator, { ...item, isGrouped: true, ticketNumber: `N° ${item.value}` }]
      }
      // Non-CREATED items remain as is
      return [...accumulator, { ...item, isGrouped: false, ticketNumber: `N° ${item.value}` }]
    },
    [],
  )

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
                  distance={'322 m'}
                  location={currentShop?.address as string}
                  name={currentShop?.name as string}
                />

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-1.5">
                  <StatCard
                    label={waitingCount?.length ? 'En attente' : 'Non disponible'}
                    value={waitingCount?.length as number}
                  />
                  <StatCard
                    label="Attente moy."
                    unit="min"
                    value={statsData?.data.avgWaitMin ?? 0}
                  />

                  <StatCard
                    label="N° courant"
                    value={
                      currentWaitingList?.current_number
                        ? String(currentWaitingList?.current_number).padStart(2, '0')
                        : 'Aucun'
                    }
                  />
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-dark-secondary border border-dark-border rounded-2xl py-3 px-3.5 mx-3 mb-2">
                <InfoRow icon={Clock} label="Horaires" value={DEFAULT_HOURS} />
                <InfoRow
                  icon={Phone}
                  isLast
                  label="Téléphone"
                  value={currentShop?.phone || (currentShop?.manager?.phone as string)}
                />
              </div>

              {/* Live Queue Section */}
              <div className="bg-dark-secondary border border-dark-border rounded-2xl py-3 px-3.5 mx-3 mb-3">
                <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2.5">
                  File en direct
                </p>
                {groupedQueue?.map((item, index) => (
                  <QueueItem
                    isLast={index === groupedQueue.length - 1}
                    key={index}
                    status={item.status}
                    ticketNumber={item.ticketNumber}
                  />
                ))}
              </div>

              {/* CTA Button */}
              <div className="px-3 pb-4">
                <button
                  className="w-full py-3.5 rounded-[14px] border-none bg-gold text-dark-bg text-sm font-medium cursor-pointer flex items-center justify-center gap-2 hover:bg-gold/90 transition-colors disabled:bg-dark-card disabled:text-white/30 disabled:cursor-not-allowed disabled:hover:bg-dark-card"
                  disabled={!isOpen}
                  onClick={handleTakeTicket}
                >
                  <Ticket className="w-4 h-4" />
                  {isOpen
                    ? deviceListNumber
                      ? 'Voir détails file'
                      : 'Tirer mon numéro'
                    : 'Pas encore disponible'}
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
