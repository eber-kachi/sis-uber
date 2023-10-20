import axios from '@lib/axios';
import { BaseAPIClass } from './BaseClass';

export default class SocioService extends BaseAPIClass {
  constructor() {
    super();
    this.baseUrl = '/api/socios';
  }

  getAllWithStatus() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}/get/all-with/status`)
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

  addCar(arg0: { socio_id: any; veiculo_id: any }) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.baseUrl}/add-car`, arg0)
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

  getReport() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}/report/download`, { responseType: 'stream' })
        .then((response) => {
          // console.log(response);
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
