import { IsNumber, IsString } from "class-validator";
export class CreateBookDto {
  @IsNumber()
  noOfPages: number;

  @IsString()
  title: string;

  @IsString()
  author: string;
}
