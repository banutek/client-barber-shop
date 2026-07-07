import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import type { IWaitingListNumbersDtoOut } from '@/dto'
import { connectSocket } from '@/lib/socket'
import { useWaitingListNumberStore } from '@/stores'

/**
 * Hook WebSocket pour les numbers d'une waiting list.
 * Rejoint la room `waiting-list-{waitingListId}` et écoute les events temps réel.
 */
export function useWaitingListNumberSocket(waitingListId: string | undefined): void {
  const setCurrentWaitingListNumber = useWaitingListNumberStore(
    (s) => s.setCurrentWaitingListNumber,
  )
  const storeRef = useRef(useWaitingListNumberStore.getState())
  const queryClient = useQueryClient()

  // Synchroniser le ref avec le store sans déclencher de re-rendu
  useEffect(() => {
    const unsub = useWaitingListNumberStore.subscribe((state) => {
      storeRef.current = state
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!waitingListId) return

    const socket = connectSocket()

    socket.emit('joinWaitingListNumber', waitingListId)

    const handleNewNumber = (data: IWaitingListNumbersDtoOut): void => {
      const current = storeRef.current.currentWaitingListNumber
      setCurrentWaitingListNumber([...current, data])
      void queryClient.invalidateQueries({
        queryKey: ['get-list-number-by-list-id', waitingListId],
      })
    }

    const handleUpdateNumber = (data: IWaitingListNumbersDtoOut): void => {
      const current = storeRef.current.currentWaitingListNumber
      setCurrentWaitingListNumber(current.map((n) => (n.id === data.id ? data : n)))
      void queryClient.invalidateQueries({
        queryKey: ['get-list-number-by-list-id', waitingListId],
      })
    }

    const handleDeleteNumber = (data: IWaitingListNumbersDtoOut): void => {
      const current = storeRef.current.currentWaitingListNumber
      setCurrentWaitingListNumber(current.filter((n) => n.id !== data.id))
      void queryClient.invalidateQueries({
        queryKey: ['get-list-number-by-list-id', waitingListId],
      })
    }

    socket.on('newNumber', handleNewNumber)
    socket.on('updateNumber', handleUpdateNumber)
    socket.on('deleteNumber', handleDeleteNumber)

    return () => {
      socket.off('newNumber', handleNewNumber)
      socket.off('updateNumber', handleUpdateNumber)
      socket.off('deleteNumber', handleDeleteNumber)
      socket.emit('leaveWaitingListNumber', waitingListId)
    }
  }, [waitingListId, setCurrentWaitingListNumber, queryClient])
}
