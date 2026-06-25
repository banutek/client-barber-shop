const API_URL: string = import.meta.env.VITE_API_URL as string

export const baseUrl = API_URL.replace('/api/v1/', '/')
export const prefixer = API_URL

export const authUrls = {
  LOGIN_USER: `${prefixer}auth/login`,
  REGISTER_USER: `${prefixer}auth/register`,
}

export const barberShopUrls = {
  GET_ALL_ACTIVE_BARBER_SHOPS: `${prefixer}barber-shop/active`,
  GET_BARBER_SHOP_BY_ID: (shopId: string) => `${prefixer}barber-shop/${shopId}`,
  // CREATE_BARBER_SHOP: `${prefixer}barber-shop/create`,

  // CREATE_WAITING_LIST: `${prefixer}waiting-list/create`,
  // GET_WAITING_LIST_BY_SHOP_ID: (shopId: string) => `${prefixer}waiting-list/by-shop-id/${shopId}`,
  // UPDATE_WAITING_LIST_STATUS: (listId: string) => `${prefixer}waiting-list/status/${listId}`,
}

export const deviceUrls = {
  CREATE_NEW_DEVICE: `${prefixer}device/create`,
  GET_DEVICE_BY_ID: (deviceId: string) => `${prefixer}device/${deviceId}`,
}

export const waitingListNumberUrls = {
  CREATE_NEW_WAITING_LIST_NUMBER: (waitingListId: string) =>
    `${prefixer}waiting-list-number/create-next/${waitingListId}`,
  GET_WAITING_LIST_NUMBER_BY_LIST_ID: (listId: string) =>
    `${prefixer}waiting-list-number/by-list/${listId}`,
  GET_WAITING_LIST_NUMBER_BY_SHOP_ID: (shopId: string) =>
    `${prefixer}waiting-list-number/by-shop-id/${shopId}`,
  UPDATE_WAITING_LIST_NUMBER_STATUS: (numberId: string) =>
    `${prefixer}waiting-list-number/status/${numberId}`,
}

export const statsUrls = {
  GET_DAILY_STATS: (shopId: string) => `${prefixer}stats/shop/${shopId}/daily`,
}

export const notificationUrls = {
  GET_NOTIFICATIONS_BY_DEVICE: (deviceId: string) => `${prefixer}notification/device/${deviceId}`,
  UPDATE_NOTIFICATION_STATUS: (notificationId: string) =>
    `${prefixer}notification/${notificationId}/status`,
}

export const pushTokenUrls = {
  REGISTER_PUSH_TOKEN: (deviceId: string) => `${prefixer}device/${deviceId}/push-token`,
}
