import { BaseAPIClass } from "./BaseClass"
import axios from "@lib/axios"

export default class ViajeService extends BaseAPIClass{
  constructor() {
    super();
    this.baseUrl = '/api/viajes';
  }


  async getByclienteoId(id: string) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}/get-by-cliente-id/${id}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error('Promise', error);
          console.info('Promise', error.message);
          // todo mostrar al usuario que paso  un error
          reject(error);
        });
    });
  }
}
