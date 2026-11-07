import BaseMethods from '../BaseMethods'
import { galleryUrls } from '../url'

export class GalleryService {
  static get_gallery_by_shop_id = (shopId: string) =>
    BaseMethods.getRequest(galleryUrls.GET_GALLERY_BY_SHOP_ID(shopId), true)
  static get_gallery_by_service_id = (serviceId: string) =>
    BaseMethods.getRequest(galleryUrls.GET_GALLERY_BY_SERVICE_ID(serviceId), true)
}
