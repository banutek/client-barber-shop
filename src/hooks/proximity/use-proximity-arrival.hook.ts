import { useEffect, useRef } from 'react'
import { useGeoStore } from '@/stores/geo'
import { haversineDistance } from '@/utils/geo'
import { WaitingListNumberStatus } from '@/dto/enums'
import type { IWaitingListNumbersDtoOut } from '@/dto'

/** Distance seuil en mètres pour considérer le client "arrivé" au salon */
const PROXIMITY_THRESHOLD_M = 50

export interface UseProximityArrivalOptions {
  /** Latitude du salon */
  shopLat: number | null | undefined
  /** Longitude du salon */
  shopLng: number | null | undefined
  /** Le number du device dans la waiting list (undefined = pas de ticket) */
  deviceListNumber: IWaitingListNumbersDtoOut | undefined
  /** Déclenché une seule fois quand le device entre dans la zone des 10m */
  onArrival: (status: WaitingListNumberStatus) => void
}

/**
 * Hook qui surveille la position GPS du device et déclenche un callback
 * lorsque le client arrive à moins de 10 mètres du salon.
 *
 * - Ne se déclenche qu'UNE seule fois par ticket (via useRef).
 * - Se réinitialise automatiquement si le deviceListNumber change (nouveau ticket).
 * - Ne fait rien si la géolocalisation n'est pas disponible.
 */
export function useProximityArrival({
  shopLat,
  shopLng,
  deviceListNumber,
  onArrival,
}: UseProximityArrivalOptions): void {
  const lat = useGeoStore((s) => s.lat)
  const lng = useGeoStore((s) => s.lng)

  // Empêche les déclenchements multiples pour le même ticket
  const hasFiredRef = useRef(false)
  // Garde une trace du numberId pour détecter un nouveau ticket
  const lastNumberIdRef = useRef<string | undefined>(undefined)

  // Réinitialiser quand le ticket change
  if (deviceListNumber?.id !== lastNumberIdRef.current) {
    hasFiredRef.current = false
    lastNumberIdRef.current = deviceListNumber?.id
  }

  useEffect(() => {
    // Pas de ticket → rien à faire
    if (!deviceListNumber) return

    // Déjà déclenché pour ce ticket
    if (hasFiredRef.current) return

    // Pas de position device
    if (lat === null || lng === null) return

    // Pas de position shop
    if (shopLat == null || shopLng == null) return

    const distance = haversineDistance(lat, lng, shopLat, shopLng)

    if (distance <= PROXIMITY_THRESHOLD_M) {
      hasFiredRef.current = true
      onArrival(deviceListNumber.status)
    }
  }, [lat, lng, shopLat, shopLng, deviceListNumber, onArrival])
}
