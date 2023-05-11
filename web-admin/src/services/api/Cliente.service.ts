import { BaseAPIClass } from "./BaseClass"

export default class ClienteService extends BaseAPIClass{
  constructor() {
    super();
    this.baseUrl = '/api/clientes';
  }
}
