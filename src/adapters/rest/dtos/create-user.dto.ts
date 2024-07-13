import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString } from "class-validator";
import { RolesEnum } from "src/domain/models/roles.enum";
export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  password?: string;

  @ApiProperty({ enum: RolesEnum })
  @IsEnum(RolesEnum)
  role = RolesEnum.ROLE_USER;
}
