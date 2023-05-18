import { api } from "./api"
import { getGeneralApiProblem } from "./apiProblem"


export class AuthService {
  baseUrl: string

  constructor() {
    this.baseUrl = "api/auth"
  }

  async login(data: any) {
    const response = await api.apisauce.post<any>(`${this.baseUrl}/login`, data)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      // hacer estrategia de login
      const rawData = response.data
      return { kind: "ok", data: rawData?.data } as {kind:string, data:any}
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

}
