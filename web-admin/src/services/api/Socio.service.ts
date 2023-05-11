import { BaseAPIClass } from "./BaseClass"

export default class SocioService extends BaseAPIClass{
  constructor() {
    super();
    this.baseUrl = '/api/socios';
  }
}
