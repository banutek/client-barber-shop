# Spécification — Scan QR Code côté App Client

**Date** : 2026-07-22
**Contexte** : Le client scanne le QR code affiché sur l'écran du coiffeur pour se faire servir automatiquement.

---

## 1. Flow utilisateur

```
1. Le coiffeur ouvre le modal "Prochain numéro" → QR code affiché
2. Le client ouvre l'app client → page "Scanner"
3. Le client scanne le QR code avec la caméra
4. Lecture du barcode → appel API
5. Succès → toast "Vous êtes servi !" + redirection
6. Échec → toast "Code invalide" + possibilité de rescanner
```

---

## 2. Librairie de scan QR code

Utiliser **[html5-qrcode](https://github.com/mebjas/html5-qrcode)** (léger, gratuit, compatible PWA) :

```bash
npm install html5-qrcode
```

Ou via CDN dans le `index.html` :
```html
<script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
```

---

## 3. Fichiers à créer dans l'app client

### 3.1 DTO

```ts
// src/dto/types/serve-by-barcode.dto.ts

export interface IServeByBarcodeDtoIn {
  barcode: string
}

export interface IServeByBarcodeDtoOut {
  success: boolean
  message: string
  data?: {
    waitingListNumber: {
      id: string
      value: string
      barcode: string
      status: string
      createdAt: string
      updatedAt: string
      inProgressAt: string | null
      completedAt: string | null
      waitingListId: string
      deviceId: string
    }
    waitingList: object
  }
}
```

### 3.2 Service

```ts
// src/services/scan/scan.service.ts

import BaseMethods from '../BaseMethods'

const API_URL = import.meta.env.VITE_API_URL

export const scanUrls = {
  SERVE_BY_BARCODE: `${API_URL}waiting-list-number/serve-by-barcode`,
}

export class ScanService {
  static serveByBarcode = (barcode: string) =>
    BaseMethods.postRequest<{ barcode: string }, { success: boolean; message: string; data?: any }>(
      scanUrls.SERVE_BY_BARCODE,
      { barcode },
      false // pas d'auth requise
    )
}
```

### 3.3 Hook React Query

```ts
// src/hooks/scan/use-serve-by-barcode.hook.ts

import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { ScanService } from '../../services'

export const useServeByBarcodeHook = () => {
  return useMutation({
    mutationKey: ['serve-by-barcode'],
    mutationFn: (barcode: string) => ScanService.serveByBarcode(barcode),
    retry: 0,
  })
}
```

### 3.4 Composant Scanner

```tsx
// src/components/qr-scanner/qr-scanner.component.tsx

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useServeByBarcodeHook } from '../../hooks'
import { useToastStore } from '../../stores'

export function QrScanner() {
  const [scanning, setScanning] = useState(false)
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const { mutate: doServeByBarcode, isPending } = useServeByBarcodeHook()
  const { addToast } = useToastStore()

  useEffect(() => {
    scannerRef.current = new Html5Qrcode('qr-reader')
    return () => {
      scannerRef.current?.stop().catch(() => {})
    }
  }, [])

  const startScanning = async () => {
    if (!scannerRef.current) return
    setScanning(true)
    try {
      await scannerRef.current.start(
        { facingMode: 'environment' }, // caméra arrière
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText: string) => {
          // QR code détecté
          setScannedBarcode(decodedText)
          scannerRef.current?.stop().catch(() => {})
          setScanning(false)

          // Appel API
          doServeByBarcode(decodedText, {
            onSuccess: (response) => {
              if (response?.data?.success) {
                addToast('Vous êtes servi ! Présentez-vous au coiffeur.', 'success')
                // Optionnel : naviguer vers une page de confirmation
              } else {
                addToast(response?.data?.message || 'Erreur inconnue', 'error')
                setScannedBarcode(null) // permet de rescanner
              }
            },
            onError: () => {
              addToast('Code-barres invalide. Veuillez réessayer.', 'error')
              setScannedBarcode(null)
            },
          })
        },
        () => {
          // erreur de scan ignorée
        },
      )
    } catch (err) {
      console.error('Erreur caméra :', err)
      setScanning(false)
    }
  }

  const stopScanning = () => {
    scannerRef.current?.stop().catch(() => {})
    setScanning(false)
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">Scanner le QR code</h2>
      <p className="text-gray-500 text-center">
        Scannez le QR code affiché sur l'écran du coiffeur pour vous faire servir.
      </p>

      <div id="qr-reader" className="w-full max-w-sm rounded-xl overflow-hidden border-2 border-gray-200" />

      {!scanning && !isPending && (
        <button
          onClick={startScanning}
          className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
        >
          Démarrer le scan
        </button>
      )}

      {scanning && (
        <button
          onClick={stopScanning}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
        >
          Arrêter le scan
        </button>
      )}

      {isPending && (
        <div className="flex items-center gap-2 text-amber-600">
          <div className="animate-spin h-5 w-5 border-2 border-amber-600 border-t-transparent rounded-full" />
          Vérification en cours...
        </div>
      )}

      {scannedBarcode && !isPending && (
        <div className="text-sm text-gray-400 font-mono break-all">
          Dernier scan : {scannedBarcode}
        </div>
      )}
    </div>
  )
}
```

### 3.5 Page Scanner (optionnelle)

Si tu veux une page dédiée plutôt qu'un composant inline :

```tsx
// src/pages/scanner/scanner.page.tsx

import { QrScanner } from '../../components/qr-scanner/qr-scanner.component'

export function ScannerPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <QrScanner />
    </div>
  )
}
```

---

## 4. Résumé des fichiers à créer

```
src/
├── dto/types/
│   └── serve-by-barcode.dto.ts          # DTOs request/response
├── services/
│   └── scan/
│       └── scan.service.ts              # Appel API POST /serve-by-barcode
├── hooks/
│   └── scan/
│       ├── index.ts
│       └── use-serve-by-barcode.hook.ts # Hook React Query
├── components/
│   └── qr-scanner/
│       └── qr-scanner.component.tsx     # Composant scanner avec html5-qrcode
└── pages/
    └── scanner/
        └── scanner.page.tsx             # Page dédiée au scan (optionnel)
```

---

## 5. Dépendances

```json
{
  "dependencies": {
    "html5-qrcode": "^2.3.8"
  }
}
```

---

## 6. Comportements clés

| Événement | Action |
|---|---|
| QR code scanné avec succès | Extraction du `barcode` → `POST /serve-by-barcode` |
| API retourne `success: true` | Toast vert "Vous êtes servi !" |
| API retourne 404 (barcode inconnu) | Toast rouge "Code-barres invalide" → possibilité de rescanner |
| API retourne 409 (déjà servi) | Toast rouge "Ce numéro a déjà été servi" |
| Erreur réseau | Toast rouge "Erreur de connexion" → bouton réessayer |
| Caméra non disponible | Message "Veuillez autoriser l'accès à la caméra" |

---

## 7. Note importante

Le QR code affiché dans l'app coiffeur contient **directement le barcode** (ex: `QF-007-A3F9C12D4E5B6F7A`), pas une URL. Le scanner `html5-qrcode` lit cette chaîne brute et l'envoie telle quelle à l'API.
