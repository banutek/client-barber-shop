import BaseMethods from '../BaseMethods'
import { scanUrls } from '../url'

export const ScanService = {
  serve_by_barcode: (barcode: string) =>
    BaseMethods.postRequest(scanUrls.SERVE_BY_BARCODE, { barcode }, false),
}
