import { BaseApiClass } from "./BaseApi.class"

export default class UserService extends BaseApiClass{
  constructor() {
    super();
    this.baseUrl = '/api/clientes';
  }

}
