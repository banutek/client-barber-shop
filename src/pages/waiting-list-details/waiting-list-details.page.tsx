import { Camera, Check, Clock, QrCode, Scissors, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { BackButton } from '../../components'
import { QrScanner } from '../../components/qr-scanner/qr-scanner.component'
import { QueueAvatarComponent, StepItemComponent } from './childrens'
import {
  type IBarberShopDtoOut,
  type IWaitingListDtoOut,
  type IWaitingListNumbersDtoOut,
  WaitingListNumberStatus,
} from '@/dto'
import {
  useGetListNumberByListIdHook,
  useUpdateWaitingListNumberStatusHook,
} from '@/hooks/waiting-list-number'
import { useProximityArrival } from '@/hooks/proximity'
import { useDailyStatsHook } from '@/hooks/stats'
import { useBarberShopSocket, useWaitingListNumberSocket } from '@/hooks/socket'
import { useDeviceStore, useWaitingListNumberStore } from '@/stores'

export interface IWaitingListDetailsPageProps {
  default_method?: () => void
  default_props?: boolean
}

export const WaitingListDetailsPage: React.FC<IWaitingListDetailsPageProps> = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { COMPLETED, CREATED, IN_PROGRESS, JUMPED, MISSING, NEXT, PENDING } =
    WaitingListNumberStatus
  // const { currentShop } = useShopStore()
  const { currentWaitingListNumber, setCurrentWaitingListNumber } = useWaitingListNumberStore()
  const { currentDevice } = useDeviceStore()
  // const { currentWaitingList} = useWaitingListStore()
  // const deviceListNumber: IWaitingListNumbersDtoOut = state?.deviceListNumber
  const currentList: IWaitingListDtoOut = state?.currentList
  const shop: IBarberShopDtoOut = state?.shop
  // Ticket data (can be passed as props in a real implementation)
  const salonName = shop?.name

  const { data: listNumberDatas } = useGetListNumberByListIdHook(currentList?.id)
  const { data: statsData } = useDailyStatsHook(shop?.id as string)

  const { mutate: doUpdateStatus } = useUpdateWaitingListNumberStatusHook()

  // Toast de bienvenue local
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null)
  // Scanner QR code
  const [showScanner, setShowScanner] = useState(false)
  const [scanMessage, setScanMessage] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)

  const estimatedMinutes = statsData?.data.avgServiceMin ?? 0
  const deviceListNumber = listNumberDatas?.data.waitingListNumbers.find(
    (_) => _.deviceId === currentDevice?.id,
  )

  // WebSocket temps réel pour les numbers de cette waiting list
  useWaitingListNumberSocket(currentList?.id)
  useBarberShopSocket(shop?.id as string)

  // Proximité : détection d'arrivée à 10m du salon
  useProximityArrival({
    shopLat: shop?.latitude,
    shopLng: shop?.longitude,
    deviceListNumber,
    onArrival: (status) => {
      if (status === WaitingListNumberStatus.CREATED) {
        doUpdateStatus(
          { numberId: deviceListNumber!.id, status: WaitingListNumberStatus.PENDING },
          {
            onSuccess: () => {
              setWelcomeMessage('Bienvenue au salon ! Votre numéro est confirmé.')
            },
          },
        )
      } else if (status === WaitingListNumberStatus.NEXT) {
        setWelcomeMessage("Bienvenue au salon ! C'est bientôt votre tour.")
      }
    },
  })
  const drawTime = deviceListNumber
    ? new Date(deviceListNumber?.createdAt).toLocaleTimeString('fr-FR')
    : ''

  // Queue data
  // const queueNumbers = [
  //   { number: '07', status: 'active' as const },
  //   { number: '08', status: 'waiting' as const },
  //   { number: '09', status: 'waiting' as const },
  //   { number: '10', status: 'waiting' as const },
  //   { number: '11', status: 'waiting' as const },
  //   { number: '12', status: 'current' as const, size: 'md' as const },
  // ]

  useEffect(() => {
    if (listNumberDatas) {
      setCurrentWaitingListNumber(listNumberDatas?.data.waitingListNumbers)
    }
  }, [listNumberDatas])

  const queueNumbers = currentWaitingListNumber.map((item, index) => ({
    number: item.value,
    size: 'md' as const,
    status:
      item.status == CREATED
        ? index === currentWaitingListNumber.length - 1
          ? 'current'
          : 'waiting'
        : item.status == IN_PROGRESS
          ? index === currentWaitingListNumber.length - 1
            ? 'current'
            : 'active'
          : index === currentWaitingListNumber.length - 1
            ? 'current'
            : 'waiting',
  }))

  console.log({ queueNumbers })

  const getPersonnesAvant = (
    numeros: IWaitingListNumbersDtoOut[],
    monNumero: IWaitingListNumbersDtoOut,
  ): number => {
    return numeros.filter(
      (n) => n.value < monNumero.value && (n.status === CREATED || n.status === IN_PROGRESS),
    ).length
  }

  const calculerProgression = (numeros: IWaitingListNumbersDtoOut[]) => {
    const total = numeros.length
    if (total === 0) return { progression: 0, total: 0, traites: 0 }

    const traites = numeros.filter((n) => n.status === COMPLETED || n.status === JUMPED).length

    return {
      progression: Math.round((traites / total) * 100),
      total,
      traites,
    }
  }

  const { progression } = calculerProgression(currentWaitingListNumber)
  const progressPercent = progression
  const peopleAhead = deviceListNumber
    ? getPersonnesAvant(currentWaitingListNumber, deviceListNumber)
    : 0

  console.log({ queueNumbers })
  console.log({ currentWaitingListNumber })
  console.log({ deviceListNumber })

  // Le bouton scan est actif uniquement quand le numéro qui précède le client est COMPLETED / JUMPED / MISSING
  // et que le client n'est pas déjà en cours de service ou déjà servi
  const canScan = (() => {
    if (!deviceListNumber || currentWaitingListNumber.length === 0) return false

    // Déjà en cours ou déjà servi → pas de scan
    if (
      [IN_PROGRESS, COMPLETED].includes(deviceListNumber.status as WaitingListNumberStatus)
    )
      return false

    // Trier par valeur pour obtenir l'ordre de la file
    const sorted = [...currentWaitingListNumber].sort((a, b) => a.value.localeCompare(b.value))

    const myIndex = sorted.findIndex((n) => n.id === deviceListNumber.id)
    if (myIndex === -1) return false

    // Premier de la file : peut scanner directement
    if (myIndex === 0) return true

    // Vérifier le numéro qui précède immédiatement le client
    const previousNumber = sorted[myIndex - 1]
    return [COMPLETED, JUMPED, MISSING].includes(previousNumber.status as WaitingListNumberStatus)
  })()

  return (
    <div className="min-h-screen w-full bg-dark-bg lg:h-screen lg:min-h-0">
      {/* Mobile-first container with max-width for large screens */}
      <div className="mx-auto w-full max-w-md lg:max-w-lg xl:max-w-xl lg:h-full">
        {/* Phone frame simulation - hidden on small screens, visible on large screens */}
        <div className="lg:h-full lg:rounded-[36px] lg:border-8 lg:border-dark-secondary lg:shadow-2xl lg:overflow-hidden">
          {/* Inner content with proper mobile styling */}
          <div className="bg-dark-bg min-h-screen lg:min-h-0 lg:h-full lg:rounded-[28px] overflow-hidden flex flex-col">
            <main className="flex-1 overflow-y-auto px-4 pb-4">
              {/* Welcome Toast */}
              {welcomeMessage && (
                <div className="fixed top-4 right-4 z-100 animate-slide-in">
                  <div className="flex items-start gap-3 bg-dark-card border border-gold/20 rounded-xl shadow-2xl p-4 max-w-sm backdrop-blur-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-gold uppercase tracking-wide mb-1">
                        Bienvenue
                      </p>
                      <p className="text-[13px] text-white/85 leading-snug">{welcomeMessage}</p>
                    </div>
                    <button
                      className="shrink-0 p-1 text-white/30 hover:text-white/70 transition-colors"
                      onClick={() => setWelcomeMessage(null)}
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Back Button */}
              <div className="my-4">
                <BackButton label={salonName} onClick={() => navigate(-1)} />
              </div>

              {/* Hero - Ticket Number */}
              <div className="relative bg-[#141418] border border-gold/20 rounded-[20px] p-5 text-center mb-2.5 overflow-hidden">
                {/* Glow Effect */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-35 h-35 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)',
                  }}
                />
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">
                  Votre numéro
                </p>
                <p className="text-[72px] font-medium text-gold leading-none">
                  {deviceListNumber?.value}
                </p>
                {[CREATED, IN_PROGRESS, NEXT, PENDING].includes(deviceListNumber?.status!) ? (
                  <p className="text-[11px] text-white/35 mt-2">
                    Tiré à {drawTime} · {peopleAhead} personnes avant vous
                  </p>
                ) : (
                  <p className="text-[11px] text-gold mt-2">
                    Tiré à {drawTime} · vous avez été servis
                  </p>
                )}
              </div>

              {/* Progress Section */}
              <div className="bg-dark-secondary border border-dark-border rounded-2xl p-3.5 mb-2">
                <div className="flex justify-between items-center mb-2.5">
                  <p className="text-xs font-medium text-text-primary">Progression</p>
                  <span className="text-[11px] text-gold font-medium">~{estimatedMinutes} min</span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.25 bg-dark-card rounded-[3px] mb-3">
                  <div
                    className="h-full bg-gold rounded-[3px] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Queue Avatars */}
                <div className="flex items-center gap-0 mb-1.5">
                  {queueNumbers.map((item, index) => (
                    <div key={item.number} style={{ zIndex: queueNumbers.length - index }}>
                      <QueueAvatarComponent
                        number={item.number}
                        size={item.size}
                        status={item.status}
                      />
                    </div>
                  ))}
                </div>
                {Number(deviceListNumber?.value) === currentList?.current_number ? (
                  deviceListNumber?.status === IN_PROGRESS ? (
                    <p className="text-[11px] text-success font-bold">{`C'est votre tour !`}</p>
                  ) : (
                    deviceListNumber?.status === COMPLETED && (
                      <p className="text-[11px] text-orange-500 font-bold">
                        {`Merci pour votre confiance !`}
                      </p>
                    )
                  )
                ) : (
                  deviceListNumber?.status !== COMPLETED && (
                    <p className="text-[11px] text-white/30">
                      {`N°${currentList?.current_number} en chaise · vous êtes ${peopleAhead + 1}ème`}
                    </p>
                  )
                )}
              </div>

              {/* Bouton Scanner QR Code */}
              <button
                className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 mb-2 ${
                  canScan
                    ? 'bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white cursor-pointer'
                    : 'bg-dark-card border border-dark-border text-white/25 cursor-not-allowed'
                }`}
                disabled={!canScan}
                onClick={() => setShowScanner(true)}
                type="button"
              >
                <Camera className="w-4 h-4" />
                {canScan
                  ? 'Scanner le QR code du coiffeur'
                  : 'Scan indisponible — attendez votre tour'}
              </button>

              {/* Scanner Modal */}
              {showScanner && (
                <QrScanner
                  onClose={() => setShowScanner(false)}
                  onError={(msg) => {
                    setScanMessage({ text: msg, type: 'error' })
                  }}
                  onSuccess={(msg) => {
                    setScanMessage({ text: msg, type: 'success' })
                    setShowScanner(false)
                    // Rafraîchir les données de la file après un scan réussi
                    void queryClient.invalidateQueries({
                      queryKey: ['get-list-number-by-list-id', currentList?.id],
                    })
                  }}
                />
              )}

              {/* Scan Result Toast */}
              {scanMessage && (
                <div className="fixed top-4 right-4 z-100 animate-slide-in">
                  <div
                    className={`flex items-start gap-3 rounded-xl shadow-2xl p-4 max-w-sm backdrop-blur-xl border ${scanMessage.type === 'success' ? 'bg-dark-card border-green-500/30' : 'bg-dark-card border-red-500/30'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[11px] font-medium uppercase tracking-wide mb-1 ${scanMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {scanMessage.type === 'success' ? 'Succès' : 'Erreur'}
                      </p>
                      <p className="text-[13px] text-white/85 leading-snug">{scanMessage.text}</p>
                    </div>
                    <button
                      className="shrink-0 p-1 text-white/30 hover:text-white/70 transition-colors"
                      onClick={() => setScanMessage(null)}
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Steps Timeline */}
              <div className="bg-dark-secondary border border-dark-border rounded-2xl p-3.5">
                <StepItemComponent
                  icon={<Check className="w-3.5 h-3.5" />}
                  status={deviceListNumber?.value ? 'completed' : 'pending'}
                  subtitle={`N°${deviceListNumber?.value} enregistré · ${drawTime}`}
                  title="Numéro tiré"
                />
                <StepItemComponent
                  icon={<Clock className="w-3.5 h-3.5" />}
                  status={deviceListNumber?.value ? 'completed' : 'pending'}
                  subtitle="Vous serez notifié"
                  title="En attente"
                />
                <StepItemComponent
                  icon={<QrCode className="w-3.5 h-3.5" />}
                  status={
                    [COMPLETED, IN_PROGRESS].includes(deviceListNumber?.status!)
                      ? 'completed'
                      : 'pending'
                  }
                  subtitle="Quand c'est votre tour"
                  title="Scanner le QR code"
                />
                <StepItemComponent
                  icon={<Scissors className="w-3.5 h-3.5" />}
                  isLast
                  status={
                    deviceListNumber?.status === IN_PROGRESS
                      ? 'current'
                      : deviceListNumber?.status === COMPLETED
                        ? 'completed'
                        : 'pending'
                  }
                  subtitle="Le coiffeur vous accueille"
                  title="Prise en charge"
                />
              </div>
            </main>

            {/* Bottom Navigation */}
            <div className="flex pt-2 pb-1 border-t border-white/6 gap-0.5 lg:rounded-b-[28px]">
              {/* <NavItemComponent icon={<Home className="w-5 h-5" />} isActive label="Ma file" />
              <NavItemComponent icon={<Camera className="w-5 h-5" />} label="Scanner" />
              <NavItemComponent icon={<Bell className="w-5 h-5" />} label="Alertes" />
              <NavItemComponent icon={<User className="w-5 h-5" />} label="Profil" /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
