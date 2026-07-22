import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useServeByBarcodeHook } from '../../hooks'

interface IQrScannerProps {
  onClose: () => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function QrScanner({ onClose, onSuccess, onError }: IQrScannerProps) {
  const [scanning, setScanning] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isRunningRef = useRef(false)
  const { mutate: doServeByBarcode, isPending } = useServeByBarcodeHook()

  useEffect(() => {
    scannerRef.current = new Html5Qrcode('qr-reader')
    return () => {
      if (isRunningRef.current) {
        scannerRef.current?.stop().catch(() => {})
        isRunningRef.current = false
      }
    }
  }, [])

  const safeStop = () => {
    if (!isRunningRef.current) return
    isRunningRef.current = false
    scannerRef.current?.stop().catch(() => {})
  }

  const startScanning = async () => {
    if (!scannerRef.current) return
    setScanning(true)
    try {
      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText: string) => {
          // QR code détecté
          safeStop()
          setScanning(false)

          doServeByBarcode(decodedText, {
            onSuccess: (response) => {
              if (response?.data?.success) {
                onSuccess(response.data.message || 'Vous êtes servi !')
              } else {
                onError(response?.data?.message || 'Code-barres invalide')
              }
            },
            onError: () => {
              onError('Code-barres invalide. Veuillez réessayer.')
            },
          })
        },
        () => {
          // Erreur de scan silencieuse (ex: mauvaise orientation)
        },
      )
      isRunningRef.current = true
    } catch {
      // eslint-disable-next-line no-console
      console.error('Erreur caméra')
      setScanning(false)
      onError("Impossible d'accéder à la caméra. Vérifiez les permissions.")
    }
  }

  const stopScanning = () => {
    safeStop()
    setScanning(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-dark-card border border-gold/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Scanner le QR code</h2>
          <button
            className="text-white/40 hover:text-white/70 transition-colors"
            onClick={() => {
              stopScanning()
              onClose()
            }}
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-[13px] text-white/50 text-center mb-4">
          Scannez le QR code affiché sur l'écran du coiffeur pour vous faire servir.
        </p>

        <div
          id="qr-reader"
          className="w-full rounded-xl overflow-hidden border-2 border-dark-border mb-4"
        />

        {!scanning && !isPending && (
          <button
            className="w-full px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
            onClick={() => void startScanning()}
            type="button"
          >
            Démarrer le scan
          </button>
        )}

        {scanning && (
          <button
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            onClick={stopScanning}
            type="button"
          >
            Arrêter le scan
          </button>
        )}

        {isPending && (
          <div className="flex items-center justify-center gap-2 text-amber-500 mt-3">
            <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full" />
            Vérification en cours...
          </div>
        )}
      </div>
    </div>
  )
}
