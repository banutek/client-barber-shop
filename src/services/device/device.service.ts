import type { INewDeviceDtoIn } from "@/dto";
import BaseMethods from "../BaseMethods";
import { deviceUrls } from "../url";

export class DeviceService {
    static create_new_device = (infos: INewDeviceDtoIn) => BaseMethods.postRequest(deviceUrls.CREATE_NEW_DEVICE, infos, false)
    static get_device_by_id = (deviceId: string) => BaseMethods.getRequest(deviceUrls.GET_DEVICE_BY_ID(deviceId), false)
}