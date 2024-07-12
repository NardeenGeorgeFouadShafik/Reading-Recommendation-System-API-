import { RolesEnum } from "./roles.enum";

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: RolesEnum;
}
