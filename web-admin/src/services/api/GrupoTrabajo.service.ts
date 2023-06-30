import { BaseAPIClass } from './BaseClass'

export default class GrupoTrabajoService extends BaseAPIClass {
  constructor() {
    super()
    this.baseUrl = '/api/grupotrabajos'
  }
}
