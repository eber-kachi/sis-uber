export interface IUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  role: IRole;
  email: string;
}

export enum IRole {
  Client = "CLIENT",
  Driver = "DRIVER",
  User = "USER",
}
