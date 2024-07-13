import { ApiProperty } from "@nestjs/swagger";
import { RolesEnum } from "./roles.enum";

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: RolesEnum;
}

export class UserClass {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: RolesEnum })
  role: RolesEnum;
}

export class LoginClass {
  @ApiProperty()
  password: string;

  @ApiProperty()
  email: string;
}
