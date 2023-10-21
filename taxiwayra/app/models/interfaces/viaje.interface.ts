
export interface IViaje {
  id: string
  createdAt: string
  updatedAt: string
  distancia_recorrida: number
  fecha: any
  estado: string
  calificacion: any
  initial_address: string
  final_address: string
  start_time: any
  end_time: any
  start_latitude: number
  start_longitude: number
  end_latitude: number
  end_longitude: number
  cliente?: Cliente,
  socio?: any
}

export interface Cliente {
  id: string
  createdAt: string
  updatedAt: string
  nombres: string
  apellidos: string
  direccionMadre: any
}
