export interface ISocio {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  nombres: string;
  apellidos: string;
  ci: string;
  nacionalidad: string;
  foto: string;
  estado: string;
  emision: string;
  vencimiento: string;
  nroLicencia: string;
  categoria: string;
  activo: boolean;
  latitude: any;
  longitude: any;
  veiculo?: IVeiculo | null;
}

export interface IVeiculo {
  id: string;
}
