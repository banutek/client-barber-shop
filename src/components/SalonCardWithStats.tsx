import { SalonCard } from './SalonCard'
import { useDailyStatsHook } from '@/hooks/stats'
import { ShopOpenStatus, type IBarberShopDtoOut } from '@/dto'

export interface SalonCardWithStatsProps {
  /** Fallback distance string, ignored when shop has lat/lng */
  distance?: string
  highlighted?: boolean
  onClick?: () => void
  shop: IBarberShopDtoOut
}

export const SalonCardWithStats: React.FC<SalonCardWithStatsProps> = ({
  distance,
  highlighted = false,
  onClick,
  shop,
}) => {
  const { data: statsData } = useDailyStatsHook(shop.id)

  const waitCount = statsData?.data.waitingCount ?? 0
  const waitTime = `${statsData?.data.avgWaitMin ?? 0} min`

  return (
    <SalonCard
      distance={distance}
      highlighted={highlighted}
      location={shop.address}
      name={shop.name}
      onClick={onClick}
      shopLat={shop.latitude}
      shopLng={shop.longitude}
      status={shop.openStatus as ShopOpenStatus}
      waitCount={waitCount}
      waitTime={waitTime}
    />
  )
}
