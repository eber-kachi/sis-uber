import axios from '@lib/axios'
import { BaseAPIClass } from './BaseClass'

export default class ClienteService extends BaseAPIClass {
  constructor() {
    super()
    this.baseUrl = '/api/clientes'
  }

  getReport() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}/report/download`, { responseType: 'stream' })
        .then((response) => {
          // console.log(response);
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
