import axios from "@lib/axios";
import { BaseAPIClass } from "./BaseClass";

export default class SocioService extends BaseAPIClass {
  constructor() {
    super();
    this.baseUrl = "/api/socios";
  }

  getAllByStatus(status: string) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}/get-by-status/${status}`)
        .then((response) => {
          // console.log(response);
          // if (response.statusText === 'OK') {
          resolve(response.data);
          // } else {
          // reject(response.data);
          // }
        })
        .catch((error) => {
          // console.error('Promise', error);
          // console.info('Promise', error.message);
          // todo mostrar al usuario que paso  un error
          reject(error);
        });
    });
  }
}
