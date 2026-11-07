import { baseUrl } from '@/services'

export const resolveImageUrl = (url: string) =>
  url.startsWith('http') || url.startsWith('blob:') ? url : `${baseUrl}${url.replace(/^\//, '')}`
