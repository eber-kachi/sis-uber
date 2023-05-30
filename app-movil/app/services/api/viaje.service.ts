import { BaseApiClass } from "./BaseApi.class"

export default class ViajeService extends BaseApiClass{
  constructor() {
    super();
    this.baseUrl = '/api/viajes';
  }

}
