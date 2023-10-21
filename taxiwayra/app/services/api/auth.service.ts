import { api } from "./api"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import { ApiResponse } from "apisauce"

export class AuthService {
  baseUrl: string

  constructor() {
    this.baseUrl = "api/auth"
  }

  async login(data: any): Promise<{ kind: "ok"; data: any } | GeneralApiProblem> {
    const response: ApiResponse<any> = await api.apisauce.post<any>(`${this.baseUrl}/login`, data)
    console.log("AuthService=>", response.data)

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

  async registerClient(
    data: any,
  ): Promise<{ kind: "ok"; message: string; data: any } | GeneralApiProblem> {
    const response: ApiResponse<any> = await api.apisauce.post<any>(`api/clientes`, data)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)

      if (problem) return problem
    }

    try {
      console.log("AuthService=>", response.data)
      // hacer estrategia de login
      const rawData = response.data
      return { kind: "ok", message: response.data.message, data: rawData.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}
