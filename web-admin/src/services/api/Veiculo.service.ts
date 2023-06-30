import { BaseAPIClass } from './BaseClass'


export default class VeiculoService extends BaseAPIClass {
  constructor() {
    super()
    this.baseUrl = '/api/veiculos'
  }
}
