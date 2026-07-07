import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { IBarberShopDtoOut } from '@/dto'
import { connectSocket } from '@/lib/socket'

/**
 * Hook WebSocket pour les shops.
 * Rejoint la room `barber-shop-{barberShopId}` et écoute les events temps réel.
 */
export function useBarberShopSocket(barberShopId: string | undefined): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!barberShopId) return

    const socket = connectSocket()

    socket.emit('joinWaitingList', barberShopId)

    const handleNewList = (_data: unknown): void => {
      void queryClient.invalidateQueries({
        queryKey: ['get-list-number-by-list-id'],
      })
    }

    const handleUpdateList = (_data: unknown): void => {
      void queryClient.invalidateQueries({
        queryKey: ['get-list-number-by-list-id'],
      })
    }

    const handleDeleteList = (_data: unknown): void => {
      void queryClient.invalidateQueries({
        queryKey: ['get-list-number-by-list-id'],
      })
    }

    socket.on('newList', handleNewList)
    socket.on('updateList', handleUpdateList)
    socket.on('deleteList', handleDeleteList)

    return () => {
      socket.off('newList', handleNewList)
      socket.off('updateList', handleUpdateList)
      socket.off('deleteList', handleDeleteList)
      socket.emit('leaveWaitingList', barberShopId)
    }
  }, [barberShopId, queryClient])
}

/**
 * Hook WebSocket global pour les nouveaux shops.
 * Écoute l'event `newBarberShop` sans room spécifique.
 */
export function useGlobalBarberShopSocket(): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = connectSocket()

    const handleNewBarberShop = (_data: IBarberShopDtoOut): void => {
      void queryClient.invalidateQueries({
        queryKey: ['get-active-shops'],
      })
    }

    socket.on('newBarberShop', handleNewBarberShop)

    return () => {
      socket.off('newBarberShop', handleNewBarberShop)
    }
  }, [queryClient])
}
