import BaseMethods from "../BaseMethods";
import { barberShopUrls } from "../url";

export class ShopService {
    static get_all_active_shop = () => BaseMethods.getRequest(barberShopUrls.GET_ALL_ACTIVE_BARBER_SHOPS, false)
    static get_barber_shop_by_id = (shopId: string) => BaseMethods.getRequest(barberShopUrls.GET_BARBER_SHOP_BY_ID(shopId), false)
    // static create_barber_shop = (infos: FormData) => BaseMethods.postFileRequest(barberShopUrls.CREATE_BARBER_SHOP, infos, true)
    // static update_waiting_list_status = (listId: string, datas: IUpdateWaitingListStatusDtoIn) => BaseMethods.patchRequest(barberShopUrls.UPDATE_WAITING_LIST_STATUS(listId), datas, true)

    // static create_waiting_list = (infos: INewWaitingListDtoIn) => BaseMethods.postRequest(barberShopUrls.CREATE_WAITING_LIST, infos, true)
}