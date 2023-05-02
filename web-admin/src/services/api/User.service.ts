import { BaseAPIClass } from "./BaseClass"


export default class UserService extends BaseAPIClass{
    constructor() {
      super();
      this.baseUrl = '/api/activities';
    }
}
