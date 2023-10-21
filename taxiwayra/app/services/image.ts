import { DEFAULT_API_CONFIG } from "./api"

export function urlImgServer(dir: string) {
  const url = DEFAULT_API_CONFIG.url

  return url + dir
}
