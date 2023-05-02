import { BaseAPIClass } from "./BaseClass"
import axios from "@lib/axios"


export class AuthService extends BaseAPIClass{
  constructor() {
    super();
    this.baseUrl = '/api/auth';
  }

  login(data:{email:string, password:string}){
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.baseUrl}/login/`, data)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.error('Promise', error);
          console.info('Promise', error.message);
          reject(error);
        });
    });
  }


}
