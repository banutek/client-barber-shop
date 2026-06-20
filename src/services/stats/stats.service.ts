import BaseMethods from '../BaseMethods'
import { statsUrls } from '../url'

export const StatsService = {
  get_daily_stats: (shopId: string) =>
    BaseMethods.getRequest(statsUrls.GET_DAILY_STATS(shopId), false),
}
