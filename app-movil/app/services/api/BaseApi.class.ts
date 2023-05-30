import { api } from "./api"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import { EpisodeSnapshotIn } from "../../models/Episode"

export abstract class BaseApiClass {
  baseUrl: string

  constructor() {
    this.baseUrl = ""
  }

  async getAll(filterObject?: any) {
    let queryString = ""
    if (filterObject) {
      const fitlerKeys = Object.keys(filterObject)
      if (fitlerKeys.length > 0) {
        queryString = "?"
      }
      fitlerKeys.forEach((key, index) => {
        if (filterObject[key] !== undefined && filterObject[key] !== null) {
          if (filterObject[key].toString().length) {
            queryString += `${key}=${filterObject[key]}&`
          }
        }
      })
      if (fitlerKeys.length > 0 && queryString[queryString.length - 1] === "&") {
        queryString = queryString.slice(0, -1)
      }
    }

    const response = await api.apisauce.get(`${this.baseUrl}${queryString}`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      // const rawData = response.data

      return { kind: "ok", data: response.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getById(id: string | number) {
    const response = await api.apisauce.get(`${this.baseUrl}/${id}`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      // const rawData = response.data

      return { kind: "ok", data: response.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async create(data: any): Promise<{ kind: "ok"; message?:string; data: any } | GeneralApiProblem> {
    const response = await api.apisauce.post(`${this.baseUrl}`, data)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data as any

      return { kind: "ok" ,message: rawData.message, data: rawData?.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async update(data: any, id: string | number) {
    const response = await api.apisauce.put(`${this.baseUrl}/${id}`, data)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      // const rawData = response.data

      return { kind: "ok", data: response.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async delete(id: string | number) {
    const response = await api.apisauce.delete(`${this.baseUrl}/${id}`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      // const rawData = response.data

      return { kind: "ok", data: response.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async enabled(id: string | number) {
    const response = await api.apisauce.get(`${this.baseUrl}/enabled/${id}`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      // const rawData = response.data

      return { kind: "ok", data: response.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}
