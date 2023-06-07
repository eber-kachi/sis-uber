import { BaseApiClass } from "./BaseApi.class"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import { ApiResponse } from "apisauce"
import { api } from "./api"

export default class UserService extends BaseApiClass {
  constructor() {
    super()
    this.baseUrl = "/api/users"
  }

 async getUserByEmail(email:string): Promise<{ kind: "ok"; data: any } | GeneralApiProblem> {
    const response: ApiResponse<any> = await api.apisauce.get<any>(`${this.baseUrl}/email/${email}`)
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
