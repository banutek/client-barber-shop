import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import type { IServeByBarcodeDtoOut } from '../../dto'
import { ScanService } from '../../services'

export const useServeByBarcodeHook = () => {
  return useMutation<AxiosResponse<IServeByBarcodeDtoOut>, Error, string>({
    mutationFn: (barcode: string) => ScanService.serve_by_barcode(barcode),
    mutationKey: ['serve-by-barcode'],
    retry: 0,
  })
}
