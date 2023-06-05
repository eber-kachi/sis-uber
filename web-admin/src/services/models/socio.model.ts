export interface ISocio {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  nombres: string;
  apellidos: string;
  ci: string;
  nacionalidad: string;
  foto: string;
  estado: null;
  emision: string;
  vencimiento: string;
  nroLicencia: string;
  categoria: string;
  activo: boolean;
  latitude: null;
  longitude: null;
  veiculo?: IVeiculo | null;
}

export interface IVeiculo {
  id: string;
}
