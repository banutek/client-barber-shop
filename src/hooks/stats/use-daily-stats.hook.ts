import { useQuery } from '@tanstack/react-query'
import { StatsService } from '../../services'
import type { IDailyStatsDtoOut } from '../../dto'
import type { AxiosResponse } from 'axios'

export const useDailyStatsHook = (shopId: string) => {
  return useQuery<AxiosResponse<IDailyStatsDtoOut>, Error>({
    enabled: !!shopId,
    queryFn: () => {
      return StatsService.get_daily_stats(shopId)
    },
    queryKey: ['get-daily-stats', shopId],
    retry: 0,
  })
}
