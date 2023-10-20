import axios from '@lib/axios';
import { BaseAPIClass } from './BaseClass';

export default class UserService extends BaseAPIClass {
  constructor() {
    super();
    this.baseUrl = '/api/users';
  }

  userRegister(formData: { email: string; role: string; password: string }) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.baseUrl}/register/`, formData)
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
          reject(error?.response?.data);
        });
    });
  }
}
