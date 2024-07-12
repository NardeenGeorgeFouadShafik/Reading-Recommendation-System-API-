import { IsEmail, IsEnum, IsString } from "class-validator";
import { RolesEnum } from "src/domain/models/roles.enum";
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password?: string;

  @IsEnum(RolesEnum)
  role = RolesEnum.ROLE_USER;
}
