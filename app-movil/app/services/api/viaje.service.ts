import { BaseApiClass } from "./BaseApi.class"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import { ApiResponse } from "apisauce"
import { api } from "./api"

export default class ViajeService extends BaseApiClass{
  constructor() {
    super();
    this.baseUrl = '/api/viajes';
  }

  async getLast(socio_id=null, client_id=null): Promise<{ kind: "ok"; data: any } | GeneralApiProblem> {
    const response: ApiResponse<any> = await api.apisauce.get<any>(`${this.baseUrl}/get-last/trip-by?socio_id=${socio_id}&cliente_id=${client_id}`)
    if (!response.ok) {
      // console.log("AuthService=>", response.data)
      const problem = getGeneralApiProblem(response)

      if (problem) return problem
    }
    try {
      // hacer estrategia de login
      const rawData = response.data
      return { kind: "ok", data: rawData?.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

 async changeStatusViajeById(param: { estado: string; viaje_id: string }): Promise<{ kind: "ok"; data: any } | GeneralApiProblem> {
    const response: ApiResponse<any> = await api.apisauce.post<any>(`${this.baseUrl}/change-status-by-id`, param)
    if (!response.ok) {
      // console.log("AuthService=>", response.data)
      const problem = getGeneralApiProblem(response)

      if (problem) return problem
    }
    try {
      // hacer estrategia de login
      const rawData = response.data
      return { kind: "ok", data: rawData?.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}
